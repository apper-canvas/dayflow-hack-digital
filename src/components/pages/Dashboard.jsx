import React, { useState } from "react";
import { motion } from "framer-motion";
import QuickAddTask from "@/components/molecules/QuickAddTask";
import TaskList from "@/components/organisms/TaskList";
import TimeBlockView from "@/components/organisms/TimeBlockView";
import CalendarView from "@/components/organisms/CalendarView";
const Dashboard = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleTaskAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleTaskUpdate = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <motion.div
    className="max-w-7xl mx-auto p-6 space-y-6"
    initial={{
        opacity: 0,
        y: 20
    }}
    animate={{
        opacity: 1,
        y: 0
    }}
    transition={{
        duration: 0.3
    }}>
    {/* Quick Add */}
    <QuickAddTask onTaskAdded={handleTaskAdded} />
    {/* Main Content */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task List */}
        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 font-heading">Your Tasks
                          </h2>
            <TaskList onTaskUpdate={handleTaskUpdate} refreshTrigger={refreshTrigger} />
        </div>
        {/* Time Block View */}
        <div className="space-y-4">
            <TimeBlockView refreshTrigger={refreshTrigger} />
        </div>
        {/* Calendar View */}
        <div className="space-y-4">
            <CalendarView refreshTrigger={refreshTrigger} />
        </div>
</div>
</motion.div>
  );
};

export default Dashboard;