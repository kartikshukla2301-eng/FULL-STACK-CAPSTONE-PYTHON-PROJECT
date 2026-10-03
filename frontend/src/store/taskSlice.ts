import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task, Project } from '../types';

interface TaskState {
  projects: Project[];
  activeProject: Project | null;
  tasks: Task[];
  loading: boolean;
}

const initialState: TaskState = {
  projects: [],
  activeProject: null,
  tasks: [],
  loading: false,
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setProjects: (state, action: PayloadAction<Project[]>) => {
      state.projects = action.payload;
      if (!state.activeProject && action.payload.length > 0) {
        state.activeProject = action.payload[0];
      }
    },
    setActiveProject: (state, action: PayloadAction<Project>) => {
      state.activeProject = action.payload;
    },
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
    },
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.unshift(action.payload);
    },
    updateTaskInState: (state, action: PayloadAction<Task>) => {
      const idx = state.tasks.findIndex((t) => t.id === action.payload.id);
      if (idx !== -1) {
        state.tasks[idx] = action.payload;
      }
    },
    deleteTaskInState: (state, action: PayloadAction<number>) => {
      state.tasks = state.tasks.filter((t) => t.id !== action.payload);
    },
  },
});

export const {
  setProjects,
  setActiveProject,
  setTasks,
  addTask,
  updateTaskInState,
  deleteTaskInState,
} = taskSlice.actions;
export default taskSlice.reducer;
