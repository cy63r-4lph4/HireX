import { NextResponse } from "next/server";
import { ethers } from "ethers";
import deployedContracts from "~~/contracts/deployedContracts";

const RPC_URL = process.env.RPC_URL!;
const RELAYER_PRIVATE_KEY = process.env.RELAYER_PRIVATE_KEY!;

const metadataStore: Record<string, any> = {};

export async function POST(req: Request) {
  try {
    const body: {
      address?: string;
      label?: string;
      metadata?: any;
      hasEFP?: boolean;
      credentialHash?: string;
    } = await req.json();

    const { address, label, metadata, hasEFP = false, credentialHash = "" } = body;

    if (!address || !label || !metadata) {
      return NextResponse.json({ error: "Missing params" }, { status: 400 });
    }

    // === Step 1: "Store" metadata (mock IPFS)
    const metadataURI = `ipfs://mock-${Date.now()}.json`;
    metadataStore[metadataURI] = metadata;

    // === Step 2: Setup provider + signer
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(RELAYER_PRIVATE_KEY, provider);

    const chainId = Number((await provider.getNetwork()).chainId);
    const contractInfo = (deployedContracts as any)[chainId]?.Profile;
    if (!contractInfo) {
      return NextResponse.json({ error: "Profile contract not deployed on this chain" }, { status: 500 });
    }

    const contract = new ethers.Contract(contractInfo.address, contractInfo.abi, wallet);

    // === Step 3: Call createProfile with correct params
    try {
      const tx = await contract.createProfile(
        address, // address _user
        String(label), // string preferredName
        metadataURI,
        Boolean(hasEFP),
        String(credentialHash),
      );

      const receipt = await tx.wait();

      return NextResponse.json({
        success: true,
        metadataURI,
        txHash: receipt.transactionHash,
      });
    } catch (err: any) {
      const errorMessage = err?.reason || err?.message || "Unknown contract error";
      console.error("Contract error:", err);
      if (errorMessage.includes("Profile already exists")) {
        return NextResponse.json({ success: false, error: "Profile already exists" }, { status: 409 });
      }

      return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
  } catch (err: any) {
    const message = err?.message || "Server error";
    console.error("Unexpected server error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
