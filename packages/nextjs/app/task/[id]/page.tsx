"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Building, Clock, DollarSign, Home, MapPin } from "lucide-react";
// import { toast } from "sonner";
import { Badge } from "~~/components/ui/badge";
import { Button } from "~~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~~/components/ui/card";
import { useTask } from "~~/hooks/useTask";
import { TaskPosting } from "~~/interface";

const TaskDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { task, loading } = useTask(id);
  const getUrgencyColor = (urgency?: TaskPosting["urgency"]) => {
    switch (urgency) {
      case "urgent":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "high":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "low":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="pt-24 flex items-center justify-center text-white">Loading...</div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen">
        <div className="pt-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Task Not Found</h1>
            <p className="text-gray-400 mb-6">The task you&apos;re looking for doesn&apos;t exist.</p>
            <Button onClick={() => router.push("/find-tasks")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Tasks
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <Button
            variant="ghost"
            onClick={() => router.push("/find-tasks")}
            className="text-gray-300 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tasks
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Task Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <Card className="glass-effect border-white/20">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-white text-2xl mb-2">{task.title}</CardTitle>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span>Posted by {task.postedBy}</span>
                      <span>•</span>
                      <span>{task.postedTime}</span>
                    </div>
                  </div>
                  <Badge className={`${getUrgencyColor(task.urgency)} border`}>{task.urgency}</Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Description */}
                <div>
                  <h3 className="text-white font-semibold mb-3">Task Description</h3>
                  <p className="text-gray-300 leading-relaxed">{task.description}</p>
                </div>

                {/* Skills */}
                {task.skills && task.skills.length > 0 && (
                  <div>
                    <h3 className="text-white font-semibold mb-3">Required Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {task.skills.map(skill => (
                        <Badge key={skill} variant="outline" className="text-blue-400 border-blue-500/30">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DetailCard icon={MapPin} label="Location" value={task.location} />
                  <DetailCard icon={Clock} label="Time Estimate" value={task.timeEstimate || "Not specified"} />
                  <DetailCard icon={DollarSign} label="Budget" value={`${task.budget} CØRE`} />
                  <DetailCard
                    icon={task.serviceType === "on-site" ? Home : Building}
                    label="Service Type"
                    value={task.serviceType === "on-site" ? "On-site visit" : "Workshop service"}
                  />
                </div>

                {/* GPS Coordinates */}
                {task.coordinates?.lat && task.coordinates?.lng && (
                  <div>
                    <h3 className="text-white font-semibold mb-3">GPS Location</h3>
                    <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg flex flex-col gap-2">
                      <div className="flex items-center space-x-2 text-blue-400 font-mono text-sm">
                        <MapPin className="w-4 h-4" />
                        <span>
                          {task.coordinates.lat}, {task.coordinates.lng}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm">
                        Use these coordinates for precise navigation to the task location.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Sidebar */}
          {/* <SidebarCard
            task={task}
            userRole={userRole}
            showChat={showChat}
            setShowChat={setShowChat}
            showManagement={showManagement}
            setShowManagement={setShowManagement}
            onTaskUpdate={handleTaskUpdate}
            handleApplyForTask={handleApplyForTask}
            handleCallClient={handleCallClient}
            handleContactClient={handleContactClient}
          /> */}
        </div>
      </div>
    </div>
  );
};

// Reusable detail card
const DetailCard: React.FC<{ icon: React.FC<any>; label: string; value: string }> = ({ icon: Icon, label, value }) => (
  <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
    <Icon className="w-5 h-5 text-blue-400" />
    <div>
      <div className="text-white font-medium">{label}</div>
      <div className="text-gray-400 text-sm">{value}</div>
    </div>
  </div>
);

export default TaskDetailsPage;
