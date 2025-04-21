import React from "react";
import TeamForm from "../components/TeamForm";
import UserForm from "../components/UserForm";
import { useData } from "../context/DataContext";

const Home: React.FC = () => {
  const { teams, getTeamUsers } = useData();

  return (
    <div className="mx-auto max-w-4xl p-4">
      <h1 className="mb-6 text-2xl font-bold">Ana Sayfa</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <TeamForm />
          <UserForm />
        </div>

        <div>
          <div className="rounded-lg bg-white p-4 shadow">
            <h2 className="mb-4 text-xl font-semibold">Current Teams</h2>
            {teams.length === 0 ? (
              <p className="text-gray-500">Team list is empty</p>
            ) : (
              <div className="space-y-4">
                {teams.map((team) => {
                  const teamUsers = getTeamUsers(team.id);
                  return (
                    <div key={team.id} className="rounded border p-3">
                      <h3 className="font-medium">{team.name}</h3>
                      <p className="text-sm text-gray-600">
                        {team.description}
                      </p>
                      <div className="mt-2">
                        <h4 className="bg-amber-100 text-sm font-medium">
                          Members ({teamUsers.length})
                        </h4>
                        {teamUsers.length > 0 ? (
                          <ul className="mt-1 text-sm">
                            {teamUsers.map((user) => (
                              <li key={user.id} className="text-gray-700">
                                {user.name} {user.role ? `(${user.role})` : ""}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-xs text-gray-500">
                            No current member yet
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
