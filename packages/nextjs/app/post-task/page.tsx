"use client";

import React, { useState } from "react";
import { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AlertCircle, Building, Home, MapPin, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "~~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~~/components/ui/card";
import { Input } from "~~/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~~/components/ui/select";
import { Textarea } from "~~/components/ui/textarea";
import { CATEGORIES, TIMEESTIMATE, URGENCYlEVEL } from "~~/constants";
import { useGeolocation } from "~~/hooks/useGeolocation";
import { useSubmitTask } from "~~/hooks/useSubmitTask";
import { TaskFormData } from "~~/interface";

export default function PostTaskPage() {
  const router = useRouter();
  const { coordinates, error, loading, detectLocation } = useGeolocation();
  const { submitTask, loading: submitting } = useSubmitTask();

  const handleLocationDetection = () => {
    detectLocation();
  };

  const [formData, setFormData] = useState<TaskFormData>({
    title: "",
    description: "",
    category: "",
    location: "",
    budget: "",
    timeEstimate: "",
    urgency: "",
    serviceType: "",
    skills: "",
    coordinates: { lat: "", lng: "" },
  });

  // 🔹 typed handleInputChange
  const handleInputChange = <K extends keyof TaskFormData>(field: K, value: TaskFormData[K]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  useEffect(() => {
    if (coordinates) {
      setFormData(prev => ({ ...prev, coordinates }));
      toast("📍 Location Detected", {
        description: "Your GPS coordinates have been captured successfully!",
      });
    }
  }, [coordinates]);

  useEffect(() => {
    if (error) {
      toast("❌ Location Error", { description: error });
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const newTask = {
        ...formData,
        budget: parseInt(formData.budget, 10),
        skills: formData.skills
          .split(",")
          .map(s => s.trim())
          .filter(Boolean),
      };

      await submitTask(newTask);

      toast("🎉 Task Posted Successfully!", {
        description: "Your task has been posted and is now visible to workers.",
      });
    } catch (err) {
      toast("❌ Failed to post task", {
        description: (err as Error).message,
      });
    }
  };

  return (
    <>
      <Head>
        <title>Post a Task - HireX | Hire Skilled Workers with CØRE Tokens</title>
        <meta
          name="description"
          content="Post your task on HireX and connect with skilled workers. Pay with CØRE cryptocurrency for electricians, plumbers, cooks, drivers, and more."
        />
      </Head>

      <div className="min-h-screen">
        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-5xl font-orbitron font-bold gradient-text mb-4">Post a Task</h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Connect with skilled workers and pay with <span className="core-token">CØRE</span> tokens for quality
                services
              </p>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="glass-effect border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <Plus className="w-6 h-6 text-blue-400" />
                    <span>Task Details</span>
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-white font-medium mb-2">Task Title *</label>
                        <Input
                          placeholder="e.g., Fix Kitchen Electrical Outlet"
                          value={formData.title}
                          onChange={e => handleInputChange("title", e.target.value)}
                          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-white font-medium mb-2">Description *</label>
                        <Textarea
                          placeholder="Describe your task in detail..."
                          value={formData.description}
                          onChange={e => handleInputChange("description", e.target.value)}
                          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 min-h-[100px]"
                        />
                      </div>

                      <div>
                        <label className="block text-white font-medium mb-2">Category *</label>
                        <Select value={formData.category} onValueChange={value => handleInputChange("category", value)}>
                          <SelectTrigger className="bg-white/10 border-white/20 text-white">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-white/20">
                            {CATEGORIES.map(category => (
                              <SelectItem
                                key={category.value}
                                value={category.value}
                                className="text-white hover:bg-white/10"
                              >
                                {category.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="block text-white font-medium mb-2">Urgency Level *</label>
                        <Select value={formData.urgency} onValueChange={value => handleInputChange("urgency", value)}>
                          <SelectTrigger className="bg-white/10 border-white/20 text-white">
                            <SelectValue placeholder="Select urgency" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-white/20">
                            {URGENCYlEVEL.map(level => (
                              <SelectItem
                                key={level.value}
                                value={level.value}
                                className="text-white hover:bg-white/10"
                              >
                                <span className={level.color}>{level.label}</span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Location and Service Type */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-white font-medium mb-2">Location *</label>
                        <div className="flex space-x-2">
                          <Input
                            placeholder="Enter your location"
                            value={formData.location}
                            onChange={e => handleInputChange("location", e.target.value)}
                            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                          />
                          <Button
                            type="button"
                            onClick={handleLocationDetection}
                            className="bg-blue-600 hover:bg-blue-700 px-3"
                          >
                            <MapPin className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-white font-medium mb-2">Service Type *</label>
                        <Select
                          value={formData.serviceType}
                          onValueChange={value => handleInputChange("serviceType", value)}
                        >
                          <SelectTrigger className="bg-white/10 border-white/20 text-white">
                            <SelectValue placeholder="Select service type" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-white/20">
                            <SelectItem value="on-site" className="text-white hover:bg-white/10">
                              <div className="flex items-center space-x-2">
                                <Home className="w-4 h-4" />
                                <span>On-site (Worker comes to you)</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="workshop" className="text-white hover:bg-white/10">
                              <div className="flex items-center space-x-2">
                                <Building className="w-4 h-4" />
                                <span>Workshop (You go to worker)</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Budget and Time */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-white font-medium mb-2">Budget (CØRE Tokens) *</label>
                        <div className="relative">
                          <Input
                            type="number"
                            placeholder="150"
                            value={formData.budget}
                            onChange={e => handleInputChange("budget", e.target.value)}
                            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 pr-16"
                          />
                          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 core-token text-sm font-bold">
                            CØRE
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-white font-medium mb-2">Estimated Time</label>
                        <Select
                          value={formData.timeEstimate}
                          onValueChange={value => handleInputChange("timeEstimate", value)}
                        >
                          <SelectTrigger className="bg-white/10 border-white/20 text-white">
                            <SelectValue placeholder="Select time estimate" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-white/20">
                            {TIMEESTIMATE.map(time => (
                              <SelectItem key={time.value} value={time.value} className="text-white hover:bg-white/10">
                                {time.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Skills Required */}
                    <div>
                      <label className="block text-white font-medium mb-2">Required Skills (comma-separated)</label>
                      <Input
                        placeholder="e.g., Electrical Repair, Safety Certified"
                        value={formData.skills}
                        onChange={e => handleInputChange("skills", e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      />
                    </div>

                    {/* Important Notice */}
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
                        <div>
                          <h4 className="text-blue-400 font-semibold mb-1">Payment Information</h4>
                          <p className="text-gray-300 text-sm">
                            Payment will be held in escrow until task completion. CØRE tokens will be automatically
                            transferred to the worker upon your approval.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end space-x-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push("/find-tasks")}
                        className="neon-border bg-transparent hover:bg-white/10"
                      >
                        Cancel
                      </Button>
                      <Button
                        disabled={submitting || loading}
                        type="submit"
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 crypto-glow px-8"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Post Task
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
