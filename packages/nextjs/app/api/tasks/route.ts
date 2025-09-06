import { NextResponse } from "next/server";
import { ethers } from "ethers";
import deployedContracts from "~~/contracts/deployedContracts";
import { TaskPayload } from "~~/interface";
import { readMetadataByCid, saveMetadataAsCid } from "~~/lib/metadata";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ——— Types ———
interface CreateJobBody extends TaskPayload {
  hirer: string; // required: wallet address of job creator
  deadline?: number; // unix seconds; must be > now
  tokenDecimals?: number; // override if your ERC20 is not 18
}

// ——— Helpers ———
function deriveDeadlineSeconds(timeEstimate?: string): number {
  const now = Math.floor(Date.now() / 1000);
  const table: Record<string, number> = {
    "1-2 hours": 2 * 3600,
    "2-3 hours": 3 * 3600,
    "3-4 hours": 4 * 3600,
    "4-6 hours": 6 * 3600,
    "1 day": 24 * 3600,
    "2-3 days": 3 * 24 * 3600,
    "1 week": 7 * 24 * 3600,
  };
  const add = timeEstimate && table[timeEstimate] ? table[timeEstimate] : 48 * 3600;
  return now + add;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CreateJobBody;

    if (!body.hirer) {
      return NextResponse.json({ error: "hirer (wallet address) is required" }, { status: 400 });
    }

    // Basic validation
    const required: (keyof TaskPayload)[] = [
      "title",
      "description",
      "category",
      "location",
      "budget",
      "urgency",
      "serviceType",
      "skills",
      "coordinates",
    ];
    for (const key of required) {
      if (
        body[key] === undefined ||
        body[key] === null ||
        (typeof body[key] === "string" && !String(body[key]).trim())
      ) {
        console.error(`[VALIDATION FAILED] Missing field: ${key}`);
        return NextResponse.json({ error: `Missing field: ${key}` }, { status: 400 });
      }
    }
    console.log("[3] Validation passed");

    if (!Array.isArray(body.skills)) {
      return NextResponse.json({ error: "skills must be an array of strings" }, { status: 400 });
    }
    if (!body.coordinates?.lat || !body.coordinates?.lng) {
      return NextResponse.json({ error: "coordinates.lat and coordinates.lng are required" }, { status: 400 });
    }
    if (typeof body.budget !== "number" || body.budget <= 0) {
      return NextResponse.json({ error: "budget must be a positive number" }, { status: 400 });
    }

    // Metadata
    const metadata = {
      title: body.title,
      description: body.description,
      category: body.category,
      location: body.location,
      budgetTokens: body.budget,
      timeEstimate: body.timeEstimate ?? null,
      urgency: body.urgency,
      serviceType: body.serviceType,
      skills: body.skills,
      coordinates: body.coordinates,
      hirer: body.hirer,
      createdAt: Date.now(),
    };

    const { cid } = saveMetadataAsCid(metadata);

    // Onchain setup
    const RPC_URL = process.env.RPC_URL!;
    const RELAYER_PRIVATE_KEY = process.env.RELAYER_PRIVATE_KEY!;
    if (!RPC_URL || !RELAYER_PRIVATE_KEY) {
      console.error("[CONFIG ERROR] RPC_URL or RELAYER_PRIVATE_KEY missing");
      return NextResponse.json({ error: "RPC_URL or RELAYER_PRIVATE_KEY not set" }, { status: 500 });
    }

    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(RELAYER_PRIVATE_KEY, provider);
    const network = await provider.getNetwork();

    const chainId = Number(network.chainId);
    const jobFactoryInfo = (deployedContracts as any)[chainId]?.JobFactory;
    if (!jobFactoryInfo) {
      return NextResponse.json({ error: "JobFactory contract not found for current chain" }, { status: 500 });
    }
    console.log("[8] Loaded JobFactory:", jobFactoryInfo.address);

    const contract = new ethers.Contract(jobFactoryInfo.address, jobFactoryInfo.abi, wallet);

    // Budget
    const decimals = body.tokenDecimals ?? Number(process.env.CORE_TOKEN_DECIMALS ?? 18);
    const budgetRaw = ethers.parseUnits(body.budget.toString(), decimals);

    // Deadline
    const deadline =
      typeof body.deadline === "number" && body.deadline > Math.floor(Date.now() / 1000)
        ? body.deadline
        : deriveDeadlineSeconds(body.timeEstimate);

    const tx = await contract.createJob(body.hirer, body.title, cid, budgetRaw, deadline);

    const receipt = await tx.wait();

    let jobId: string | undefined;
    try {
      const iface = new ethers.Interface(jobFactoryInfo.abi);
      for (const log of receipt.logs ?? []) {
        try {
          const parsed = iface.parseLog(log);
          if (parsed?.name === "JobCreated") {
            jobId = parsed.args?.[0]?.toString();
            break;
          }
        } catch {}
      }
    } catch (e) {
      console.warn("[WARN] Event parsing failed:", e);
    }

    return NextResponse.json(
      {
        success: true,
        jobId,
        cid,
        metadataUrl: `/api/metadata/${cid}`,
        txHash: receipt.hash,
        deadline,
        hirer: body.hirer,
      },
      { status: 201 },
    );
  } catch (err: any) {
    console.error("[FATAL ERROR] create job failed:", err);
    return NextResponse.json({ error: err?.reason || err?.message || "Unknown server error" }, { status: 500 });
  }
}

export type TaskPosting = {
  id: number;
  title: string;
  description: string;
  category: string;
  location: string;
  coordinates?: { lat: number; lng: number };
  budget: number;
  timeEstimate: string;
  urgency: "urgent" | "high" | "medium" | "low";
  serviceType: "on-site" | "workshop";
  rating: number;
  reviews: number;
  postedBy: string;
  postedTime: string;
  skills: string[];
  status?: "assigned" | "completed" | "cancelled" | "open";
};

export async function GET() {
  const RPC_URL = process.env.RPC_URL!;
  const RELAYER_PRIVATE_KEY = process.env.RELAYER_PRIVATE_KEY!;

  if (!RPC_URL || !RELAYER_PRIVATE_KEY) {
    console.error("[CONFIG ERROR] RPC_URL or RELAYER_PRIVATE_KEY missing");
    return NextResponse.json({ error: "RPC_URL or RELAYER_PRIVATE_KEY not set" }, { status: 500 });
  }

  try {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(RELAYER_PRIVATE_KEY, provider);

    const chainId = Number((await provider.getNetwork()).chainId);
    const contractInfo = (deployedContracts as any)[chainId]?.JobFactory;

    if (!contractInfo) {
      return NextResponse.json({ error: "JobFactory contract not deployed on this chain" }, { status: 500 });
    }

    const contract = new ethers.Contract(contractInfo.address, contractInfo.abi, wallet);

    // === Fetch jobs
    const jobs = await contract.getAllJobs();

    // === Transform & filter
    const parsedJobs: TaskPosting[] = jobs
      .map((job: any) => {
        const metadata = readMetadataByCid(job.metadataURI) || {};
        return {
          id: Number(job.id),
          title: metadata.title || job.title || "Untitled",
          description: metadata.description || "",
          category: metadata.category || "general",
          location: metadata.location || "unknown",
          coordinates: metadata.coordinates,
          budget: Number(job.budget),
          timeEstimate: metadata.timeEstimate || "N/A",
          urgency: metadata.urgency || "medium",
          serviceType: metadata.serviceType || "on-site",
          rating: metadata.rating || 0,
          reviews: metadata.reviews || 0,
          postedBy: job.client,
          postedTime: metadata.postedTime || new Date().toISOString(),
          skills: metadata.skills || [],
          status:
            job.status === 0 ? "open" : job.status === 1 ? "assigned" : job.status === 2 ? "completed" : "cancelled",
        } as TaskPosting;
      })
      .filter((job: any) => job.status === "open");

    return NextResponse.json(parsedJobs);
  } catch (err: any) {
    console.error("Error fetching tasks:", err);
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 });
  }
}
