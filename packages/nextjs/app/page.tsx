"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, Search } from "lucide-react";
import type { NextPage } from "next";
// import { useAccount } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Button } from "~~/components/ui/button";
import { Card, CardContent } from "~~/components/ui/card";
import { InfiniteScroller } from "~~/components/ui/infinite-scroller";
import { SERVICES } from "~~/constants";

const Home: NextPage = () => {
  // const { address: connectedAddress } = useAccount();

  return (
    <>
      <div className="flex items-center flex-col grow pt-10">
        <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-orbitron font-bold mb-6">
                <span className="gradient-text">HireX</span>
                <br />
                <span className="text-white">Web3 Task Platform</span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Connect with skilled workers using <span className="core-token">CØRE</span> cryptotoken. Find
                electricians, plumbers, cooks, and more with GPS precision.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/find-tasks">
                  <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 crypto-glow text-lg px-8 py-3">
                    <Search className="w-5 h-5 mr-2" />
                    Find Tasks
                  </Button>
                </Link>

                <Link href="/post-task">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto neon-border text-lg px-8 py-3 bg-transparent hover:bg-white/10"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Post a Task
                  </Button>
                </Link>
              </div>
            </motion.div>

            <div className="relative mt-16">
              <motion.div
                className="absolute top-0 left-1/4 w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full floating-animation"
                style={{ animationDelay: "0s" }}
              />
              <motion.div
                className="absolute top-10 right-1/4 w-16 h-16 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-full floating-animation"
                style={{ animationDelay: "2s" }}
              />
              <motion.div
                className="absolute top-20 left-1/2 w-12 h-12 bg-gradient-to-br from-green-500/20 to-cyan-500/20 rounded-full floating-animation"
                style={{ animationDelay: "4s" }}
              />
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-orbitron font-bold gradient-text mb-4">Available Services</h2>
              <p className="text-gray-300 text-lg">Connect with skilled professionals across various industries</p>
            </motion.div>

            <InfiniteScroller speed="slow">
              {SERVICES.map((service, index) => (
                <motion.div
                  key={`${service.name}-${index}`}
                  whileHover={{ y: -5 }}
                  className="group w-[180px] flex-shrink-0"
                >
                  <Card className="glass-effect border-white/20 hover:border-white/40 transition-all duration-300 cursor-pointer h-full">
                    <CardContent className="p-6 text-center">
                      <div
                        className={`w-12 h-12 mx-auto mb-4 rounded-lg bg-gradient-to-br ${service.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                      >
                        <service.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                        {service.name}
                      </h3>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </InfiniteScroller>
          </div>
        </section>

        <div className="grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col md:flex-row">
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <BugAntIcon className="h-8 w-8 fill-secondary" />
              <p>
                Tinker with your smart contract using the{" "}
                <Link href="/debug" passHref className="link">
                  Debug Contracts
                </Link>{" "}
                tab.
              </p>
            </div>
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <MagnifyingGlassIcon className="h-8 w-8 fill-secondary" />
              <p>
                Explore your local transactions with the{" "}
                <Link href="/blockexplorer" passHref className="link">
                  Block Explorer
                </Link>{" "}
                tab.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
