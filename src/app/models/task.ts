export interface Task
{
    id?: string
    title: string;
    description: string;
    completed: boolean;
    dueDate: Date;
    stateHistory: StateHistory[];
    notes: string[];
}

export interface StateHistory
{
  state?: string;
  date?: string;
}
