"use client";

import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Car, ChefHat, Clock, Lightbulb, MapPin, Paintbrush, Scissors, Search, Star, Wrench } from "lucide-react";
import { Badge } from "~~/components/ui/badge";
import { Button } from "~~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~~/components/ui/card";
import { Input } from "~~/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~~/components/ui/select";
import { useFetchTasks } from "~~/hooks/useFetchTask";

// Types for tasks
type Task = {
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

const categories = [
  { value: "all", label: "All Categories", icon: Search },
  { value: "electrician", label: "Electricians", icon: Wrench },
  { value: "plumber", label: "Plumbers", icon: Paintbrush },
  { value: "driver", label: "Drivers", icon: Car },
  { value: "cook", label: "Cooks", icon: ChefHat },
  { value: "seamstress", label: "Seamstress", icon: Scissors },
  { value: "cleaner", label: "Cleaners", icon: Lightbulb },
];

const locations = [
  { value: "all", label: "All Locations" },
  { value: "downtown", label: "Downtown" },
  { value: "midtown", label: "Midtown" },
  { value: "uptown", label: "Uptown" },
  { value: "brooklyn", label: "Brooklyn" },
  { value: "airport", label: "Airport Area" },
];

function getUrgencyColor(urgency: Task["urgency"]): string {
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
}

function getCategoryIcon(category: string) {
  const categoryData = categories.find(cat => cat.value === category);
  return categoryData ? categoryData.icon : Search;
}

export default function FindTasksPage() {
  const { tasks, loading, error } = useFetchTasks();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");

  const router = useRouter();

  const filteredTasks = tasks.filter(task => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || task.category === selectedCategory;
    const matchesLocation =
      selectedLocation === "all" || task.location.toLowerCase().includes(selectedLocation.toLowerCase());

    return matchesSearch && matchesCategory && matchesLocation;
  });

  return (
    <>
      <Head>
        <title>Find Tasks - HireX | Discover Local Service Opportunities</title>
        <meta
          name="description"
          content="Browse available tasks on HireX. Find electrician, plumber, cook, driver, and other service opportunities near you. Earn CØRE tokens for your skills."
        />
      </Head>

      <div className="min-h-screen">
        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-5xl font-orbitron font-bold gradient-text mb-4">Find Tasks</h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Discover opportunities to earn <span className="core-token">CØRE</span> tokens by providing your skills
                and services
              </p>
            </motion.div>

            {/* Search + Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="glass-effect rounded-xl p-6 mb-8 border border-white/20"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search Input */}
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search tasks..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-white/20">
                    {categories.map(category => (
                      <SelectItem key={category.value} value={category.value} className="text-white hover:bg-white/10">
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Location Filter */}
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-white/20">
                    {locations.map(location => (
                      <SelectItem key={location.value} value={location.value} className="text-white hover:bg-white/10">
                        {location.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </motion.div>

            {/* Results */}
            {loading ? (
              <p className="text-gray-400">Loading tasks...</p>
            ) : error ? (
              <p className="text-red-400">{error}</p>
            ) : (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="mb-6"
                >
                  <p className="text-gray-300">
                    Found <span className="text-blue-400 font-semibold">{filteredTasks.length}</span> tasks
                  </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredTasks.map((task, index) => {
                    const CategoryIcon = getCategoryIcon(task.category);

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
                                    by {task.postedBy} • {task.postedTime}
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
                              {task.status && (
                                <Badge
                                  className={`text-xs ${
                                    task.status === "assigned"
                                      ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                                      : task.status === "completed"
                                        ? "bg-green-500/20 text-green-400 border-green-500/30"
                                        : task.status === "cancelled"
                                          ? "bg-red-500/20 text-red-400 border-red-500/30"
                                          : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                                  } border`}
                                >
                                  {task.status}
                                </Badge>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>

                {filteredTasks.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="text-center py-12"
                  >
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-500/20 to-gray-600/20 rounded-full flex items-center justify-center">
                      <Search className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">No tasks found</h3>
                    <p className="text-gray-400 mb-6">
                      Try adjusting your search criteria or check back later for new opportunities.
                    </p>
                    <Button
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      onClick={() => router.push("/post-task")}
                    >
                      Post a Task Instead
                    </Button>
                  </motion.div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
