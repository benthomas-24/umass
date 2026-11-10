import { Agent } from "./simulation_object/agent.js";
import type { Structure } from "./simulation_object/structure.js";
import { View } from "./view.js";

export class Model {
  private agents = new Map<string, Agent>();
  private structures = new Map<string, Structure>();
  private views: View[] = [];
  private static instance: Model;
  private constructor() {}
  static getInstance(): Model {
    if (this.instance == null) {
      Model.instance = new Model();
    }
    return Model.instance;
  }

  // Call next tick on every simulation object
  nextTick() {}

  // Add the given agent to the simulation and ask it to broadcast
  // its initial state.
  // If an agent with the same ID already exists, throws an Error with
  // the message `Agent "${agent.id}" already exists`
  addAgent(agent: Agent) {
    this.agents.set(agent.id, agent);
  }

  // Return the agent with the specified id.
  // If no agent with that id exists, throws an Error with the message
  // `Agent "${id}" not found`
  getAgent(id: string): Agent {
    if (this.agents.has(id)) {
      return this.agents.get(id)!;
    }
    throw Error(`ID ${id} was not found`);
  }

  // Remove the agent with the specified id from the simulation.
  // If no agent with that id exists, throws an Error with the message
  // `Couldn't remove agent "${id}": Not found`
  removeAgent(id: string) {
    if (this.agents.has(id)) {
      this.agents.delete(id);
      return;
    }
    throw Error(`ID ${id} was not found`);
  }

  // Add the given structure to the simulation and ask it to broadcast
  // its initial state.
  // If a structure with the same ID already exists, throws
  // an Error with the message `Structure "${structure.id}" already exists`
  addStructure(structure: Structure) {
    this.structures.set(structure.id, structure);
  }

  // Return the structure with the specified id.
  // If no structure with that id exists, throws an Error with the message
  // `Structure ${id} not found`
  getStructure(id: string): Structure {
    if (this.structures.has(id)) {
      return this.structures.get(id)!;
    }
    throw Error(`Structure ${id} not found`);
  }

  // Remove the structure with the specified id from the simulation.
  // If no agent with that id exists, throws an Error with the message
  // `Couldn't remove structure "${id}": Not found`
  removeStructure(id: string) {
    if (this.structures.has(id)) {
      this.structures.delete(id);
      return;
    }
    throw Error(`Structure ${id} not found`);
  }

  // Subscribe the given view to receive updates from the model.
  attach(view: View): void {
    if (!this.views.includes(view)) {
      this.views.push(view);
      return;
    }
    console.log(`${view} has already been subscribed`);
  }

  // Unsubscribe the given view from model updates.
  detach(view: View): void {
    const index = this.views.indexOf(view);
    if (index !== -1) {
      this.views.splice(index, 1);
      return;
    }
    console.log(`${view} is already unsubscribed`);
  }
}
