// src/pages/TaskBoardWrapper.jsx
import { useParams } from "react-router-dom";
import TaskBoard from "./TaskBoard";

const TaskBoardWrapper = () => {
  const { id } = useParams(); // this is workspace ID from route param
  return <TaskBoard workspaceId={id} />;
};

export default TaskBoardWrapper;
