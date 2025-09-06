import { useState } from "react";
import { toast } from "sonner";

interface CreateProfileData {
  address: string;
  label: string;
  description: string;
  skills: string[];
  hasEFP?: boolean;
  credentialHash?: string;
}

export const useCreateProfile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProfile = async (data: CreateProfileData) => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      const response = await fetch("/api/createProfile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: data.address,
          label: data.label,
          metadata: {
            description: data.description,
            skills: data.skills,
          },
          hasEFP: data.hasEFP ?? false,
          credentialHash: data.credentialHash ?? "",
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Unknown error");
        toast.error(result.error || "Profile creation failed");
        setIsLoading(false);
        return;
      }

      setIsSuccess(true);
      toast.success(`Your profile ${data.label} was successfully created!`);
    } catch (err: any) {
      setError(err.message || "Server error");
      toast.error(err.message || "Server error");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createProfile,
    isLoading,
    isSuccess,
    error,
  };
};
