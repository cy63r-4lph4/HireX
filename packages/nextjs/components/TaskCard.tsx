"use client";

import { useRouter } from "next/navigation";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { motion } from "framer-motion";
import { Clock, MapPin, Star } from "lucide-react";
import { useGetProfile } from "~~/hooks/useGetProfile";
import { TaskPosting } from "~~/interface";

interface TaskCardProps {
  task: TaskPosting;
  index: number;
  getUrgencyColor: (urgency: TaskPosting["urgency"]) => string;
  CategoryIcon: React.FC<{ className?: string }>;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, index, getUrgencyColor, CategoryIcon }) => {
  const router = useRouter();

  // Fetch poster profile by wallet address
  const { profile } = useGetProfile(task.postedBy);
  const displayName = profile?.ensName || task.postedBy;

  const statusColorMap: Record<NonNullable<TaskPosting["status"]>, string> = {
    assigned: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    completed: "bg-green-500/20 text-green-400 border-green-500/30",
    cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
    open: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  };

  return (
    <motion.div
      key={task.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      <Card className="glass-effect border-white/20 hover:border-blue-500/50 transition-all duration-300 h-full">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <CategoryIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-white text-lg">{task.title}</CardTitle>
                <p className="text-gray-400 text-sm">
                  by {displayName} • {task.postedTime}
                </p>
              </div>
            </div>
            <Badge className={`${getUrgencyColor(task.urgency)} border`}>{task.urgency}</Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-gray-300">{task.description}</p>

          <div className="flex flex-wrap gap-2">
            {task.skills.map(skill => (
              <Badge key={skill} variant="outline" className="text-blue-400 border-blue-500/30">
                {skill}
              </Badge>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2 text-gray-300">
              <MapPin className="w-4 h-4 text-blue-400" />
              <span>{task.location}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-300">
              <Clock className="w-4 h-4 text-green-400" />
              <span>{task.timeEstimate}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-white font-semibold">{task.rating}</span>
                <span className="text-gray-400">({task.reviews})</span>
              </div>
              <Badge className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border-yellow-500/30">
                {task.budget} <span className="core-token ml-1">CØRE</span>
              </Badge>
            </div>

            <Button
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              onClick={() => router.push(`/task/${task.id}`)}
            >
              View Details
            </Button>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>Service: {task.serviceType === "on-site" ? "On-site visit" : "Workshop"}</span>
            {task.status && <Badge className={`text-xs ${statusColorMap[task.status]} border`}>{task.status}</Badge>}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
