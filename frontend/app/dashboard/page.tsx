
"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tasks, setTasks] = useState<any[]>([]);
const [users, setUsers] = useState<any[]>([]);
const [assignedTo, setAssignedTo] = useState("");
const fetchTasks = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log("CURRENT USER ID:", user?.id);
  
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("assigned_to", user?.id)
    .order("created_at", { ascending: false });

  if (!error && data) {
    setTasks(data);
  }
  console.log("TASKS:", data);
console.log("ERROR:", error);
};
const fetchUsers = async () => {
  const { data, error } = await supabase
    .from("users")
    .select("*");
 console.log("USERS DATA:", data);
  console.log("USERS ERROR:", error);

  if (!error && data) {
    setUsers(data);
  }
};

useEffect(() => {
  const getUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    setUser(user);

    if (user) {
      const { data: existingUser } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (!existingUser) {
        await supabase.from("users").insert([
          {
            id: user.id,
            email: user.email,
            name:
              user.user_metadata?.full_name ||
              user.user_metadata?.name,
          },
        ]);
      }
    }

    fetchTasks();
    fetchUsers();
  };

  getUser();
}, []);  

  const createTask = async () => {
    const { error } = await supabase.from("tasks").insert([
      {
        title,
        description,
        status: "pending",
        assigned_to: assignedTo,
        assigned_by: user?.id,
      },
    ]);
 const assignedUser = users.find(
  (u) => u.id === assignedTo
);

await fetch("http://127.0.0.1:5000/send-task-email", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: assignedUser?.email,
    title,
  }),
});
    if (!error) {
      alert("Task Created");
      setTitle("");
      setDescription("");
      fetchTasks();
    } else {
      console.log(error);
    }
    
  };
  console.log("USERS:", users);
  console.log(user);
console.log(user?.user_metadata);
  
  return (
    <div className="min-h-screen bg-[#111111] text-white p-8">

  <div className="flex justify-between items-center mb-10">

    <div>
      <h1 className="text-4xl font-bold text-pink-300">
        HairDrama Task Manager
      </h1>

      <p className="text-gray-400 mt-2">
        Welcome, {user?.user_metadata?.full_name}
      </p>
    </div>

    <div className="flex items-center gap-4">
      
      <img
          src={
          user?.user_metadata?.picture ||
          user?.user_metadata?.avatar_url ||
          `https://ui-avatars.com/api/?name=${
            user?.user_metadata?.full_name || "User"
          }`
          }
        alt="profile"
        className="w-12 h-12 rounded-full border border-pink-400"
        
        />
          
        <button
         onClick={async () => {
          await supabase.auth.signOut();
          window.location.href = "/";
          }}
          className="bg-[#8B1538] px-4 py-2 rounded-lg"
          >
         Logout
        </button>

    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

  <div className="bg-[#1a1a1a] p-5 rounded-xl">
    <p className="text-gray-400">
      Total Tasks
    </p>

    <h2 className="text-3xl font-bold">
      {tasks.length}
    </h2>
  </div>

  <div className="bg-[#1a1a1a] p-5 rounded-xl">
    <p className="text-gray-400">
      Pending Tasks
    </p>

    <h2 className="text-3xl font-bold text-yellow-400">
      {
        tasks.filter(
          (t) => t.status === "pending"
        ).length
      }
    </h2>
  </div>

  <div className="bg-[#1a1a1a] p-5 rounded-xl">
    <p className="text-gray-400">
      Completed Tasks
    </p>

    <h2 className="text-3xl font-bold text-green-400">
      {
        tasks.filter(
          (t) => t.status === "completed"
        ).length
            }
          </h2>
     </div>

    </div>
              
     </div>
      {/* Task Form */}
      <div className="flex flex-col gap-4  max-w-xl bg-[#1a1a1a] p-6 rounded-2xl">
        <input
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-[#111111] border border-[#8B1538] text-white p-3 rounded-lg"
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="bg-[#111111] border border-[#8B1538] text-white p-3 rounded-lg"
        />
           <select
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            className="bg-[#111111] border border-[#8B1538] text-white p-3 rounded-lg"
          >
            <option value="">
              Assign User
            </option>

            {users.map((u) => (
              <option
                key={u.id}
                value={u.id}
              >
                {u.name}
              </option>
            ))}
          </select>

        <button
            onClick={createTask}
            className="
            bg-[#8B1538]
            hover:bg-[#a01a45]
            text-white
            p-3
            rounded-xl
            font-bold
            transition
            "
          >
            Create New Task
          </button>
      </div>

      {/* Task List */}
      <div className="mt-8">
        <h2 className="text-3xl font-bold text-pink-300 mb-6">
           My Tasks
        </h2>

        {tasks.length === 0 ? (
          <p>🎉 No tasks assigned yet
Create a task to get started</p>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="
                bg-[#1a1a1a]
                border border-[#2a2a2a]
                rounded-2xl
                p-5
                mb-4
                hover:border-pink-500
                transition
                "
            >
              <h3 className="text-xl font-bold text-pink-200 mb-2">
                {task.title}
              </h3>
              {task.description && (
                <p className="text-gray-400 mt-2 ">
                  {task.description}
                </p>
              )}
              
              <p className="text-gray-300 mb-3">
  Assigned To:{" "}
  <span className="text-white font-medium">
    {users.find((u) => u.id === task.assigned_to)?.name ||
      "Unassigned"}
  </span>
</p>

              <div className="mt-3">
                Status:
                 <span
                  className={`ml-2 px-3 py-1 rounded-full text-sm ${
                    task.status === "completed"
                      ? "bg-green-900 text-green-300"
                      : "bg-yellow-900 text-yellow-300"
                  }`}
                >
                  {task.status}
                </span>
              </div>
              {task.status !== "completed" && (
              <button
              onClick={async () => {
                await supabase
                .from("tasks")
                .update({ status: "completed" })
                .eq("id", task.id);
                const assignedUser = users.find(
                (u) => u.id === task.assigned_to
                );  
                await fetch("http://127.0.0.1:5000/task-completed-email", {
                method: "POST",
                headers: {
               "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    email: assignedUser?.email,
                    title: task.title,
                  }),
                });

                fetchTasks();
              }}
              
              className="
              mt-4
              bg-green-600
              hover:bg-green-700
              px-4
              py-2
              rounded-xl
              font-semibold
              transition
              " 
                >
                  Complete Task
                </button>
              )} 
            </div>
          ))
        )}
      </div>
    </div>
    
  );
  console.log(user?.user_metadata);
}