import React, { createContext, useState, useContext, ReactNode } from "react";
import { Team, User } from "../types";

interface DataContextType {
  teams: Team[];
  users: User[];
  addTeam: (team: Omit<Team, "id">) => void;
  addUser: (user: Omit<User, "id">) => void;
  removeUser: (userId: string) => void;
  getTeamUsers: (teamId: string) => User[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const addTeam = (teamData: Omit<Team, "id">) => {
    const newTeam: Team = {
      ...teamData,
      id: `team-${Date.now()}`,
    };
    setTeams([...teams, newTeam]);
  };

  const addUser = (userData: Omit<User, "id">) => {
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
    };
    setUsers([...users, newUser]);
  };

  const removeUser = (userId: string) => {
    setUsers(users.filter((user) => user.id !== userId));
  };

  const getTeamUsers = (teamId: string) => {
    return users.filter((user) => user.teamId === teamId);
  };

  return (
    <DataContext.Provider
      value={{
        teams,
        users,
        addTeam,
        addUser,
        removeUser,
        getTeamUsers,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
