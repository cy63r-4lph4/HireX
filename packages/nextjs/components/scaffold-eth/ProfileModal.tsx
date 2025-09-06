"use client";

import { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { motion } from "framer-motion";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { useCheckNameAvailability } from "~~/hooks/useCheckAvailability";
import { useCreateProfile } from "~~/hooks/useCreateProfile";

// <-- import your hook

type CreateProfileModalProps = {
  address: string;
  onClose: () => void;
};

const skillOptions: string[] = [
  "Developer",
  "Designer",
  "Writer",
  "Researcher",
  "Trader",
  "Educator",
  "Musician",
  "Artist",
];

const BASE_DOMAIN = "hirex.eth";

export function CreateProfileModal({ address, onClose }: CreateProfileModalProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [ensName, setEnsName] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState<string[]>([]);

  const { available, isLoading } = useCheckNameAvailability(name ? name.toLowerCase().replace(/\s+/g, "") : undefined);

  const { createProfile, isLoading: isCreating, isSuccess } = useCreateProfile();

  useEffect(() => {
    if (name) {
      const label = name.toLowerCase().replace(/\s+/g, "");
      setEnsName(`${label}.${BASE_DOMAIN}`);
    } else {
      setEnsName("");
    }
  }, [name]);

  // Close modal automatically when success
  useEffect(() => {
    if (isSuccess) {
      onClose();
    }
  }, [isSuccess, onClose]);

  const toggleSkill = (skill: string) => {
    setSkills(prev => (prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]));
  };

  const handleSubmit = () => {
    createProfile({
      address,
      label: name,
      description,
      skills,
    });
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg rounded-2xl bg-[#1a1b23]/95 border border-white/10 shadow-xl p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold gradient-text text-center">Create Your Profile</DialogTitle>
          <p className="text-center text-sm text-gray-400">Step {step} of 2</p>
        </DialogHeader>

        {/* Step 1 */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 text-white"
          >
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Your Name</label>
              <Input
                placeholder="Enter your subname (e.g. alice)"
                value={name}
                onChange={e => setName(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">ENS Name</label>
              <Input
                placeholder={`username.${BASE_DOMAIN}`}
                value={ensName}
                disabled
                className="bg-white/5 border-white/10 text-white"
              />

              {isLoading && (
                <p className="text-blue-400 text-sm flex items-center mt-1">
                  <Loader2 className="w-4 h-4 animate-spin mr-1" /> Checking...
                </p>
              )}
              {!isLoading && ensName && available && (
                <p className="text-green-400 text-sm flex items-center mt-1">
                  <CheckCircle className="w-4 h-4 mr-1" /> {ensName} is available!
                </p>
              )}
              {!isLoading && ensName && !available && (
                <p className="text-red-400 text-sm flex items-center mt-1">
                  <XCircle className="w-4 h-4 mr-1" /> {ensName} already taken
                </p>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <Button onClick={() => setStep(2)} disabled={!available}>
                Next
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 text-white"
          >
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Description</label>
              <Textarea
                placeholder="Tell us a little about yourself"
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Skills</label>
              <div className="flex flex-wrap gap-2">
                {skillOptions.map(skill => (
                  <Badge
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`cursor-pointer px-3 py-1 rounded-full transition ${
                      skills.includes(skill)
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
                        : "bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="border-white/20 text-gray-200 hover:bg-white/10"
              >
                Back
              </Button>
              <Button onClick={handleSubmit} disabled={!description || skills.length === 0 || isCreating}>
                {isCreating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Create Profile"}
              </Button>
            </div>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
}
