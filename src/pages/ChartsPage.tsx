import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import { useData } from "../context/DataContext";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#FF6B6B",
  "#6B8DFF",
];

const ChartsPage: React.FC = () => {
  const { teams, getTeamUsers } = useData();

  const pieChartData = teams.map((team) => {
    const users = getTeamUsers(team.id);
    return {
      name: team.name,
      value: users.length,
    };
  });

  const barChartData = teams.map((team) => {
    const users = getTeamUsers(team.id);

    const roleCount: Record<string, number> = {};
    users.forEach((user) => {
      const role = user.role || "No Role";
      roleCount[role] = (roleCount[role] || 0) + 1;
    });

    return {
      name: team.name,
      ...roleCount,
    };
  });

  const allRoles = new Set<string>();
  barChartData.forEach((team) => {
    Object.keys(team).forEach((key) => {
      if (key !== "name") {
        allRoles.add(key);
      }
    });
  });

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">Graphics</h1>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Pie Chart */}
        <div className="rounded-lg bg-white p-4 shadow">
          <h2 className="mb-4 text-xl font-semibold">
            Team member Distribution by Teams
          </h2>
          <div className="h-64">
            {pieChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-gray-500">
                No Data
              </div>
            )}
          </div>
        </div>

        {/* Bar Chart */}
        <div className="rounded-lg bg-white p-4 shadow">
          <h2 className="mb-4 text-xl font-semibold">Ekip Kompozisyonu</h2>
          <div className="h-64">
            {barChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barChartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {Array.from(allRoles).map((role, index) => (
                    <Bar
                      key={role}
                      dataKey={role}
                      fill={COLORS[index % COLORS.length]}
                      name={role}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-gray-500">
                No Data
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartsPage;
