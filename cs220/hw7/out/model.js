export class Model {
    // Implement this method according to the singleton pattern seen in class
    static getInstance() {
        throw new Error("Not implemented yet");
    }
    // Call next tick on every simulation object
    nextTick() { }
    // Add the given agent to the simulation and ask it to broadcast
    // its initial state.
    // If an agent with the same ID already exists, throws an Error with
    // the message `Agent "${agent.id}" already exists`
    addAgent(agent) { }
    // Return the agent with the specified id.
    // If no agent with that id exists, throws an Error with the message
    // `Agent "${id}" not found`
    getAgent(id) {
        throw new Error("Not implemented yet");
    }
    // Remove the agent with the specified id from the simulation.
    // If no agent with that id exists, throws an Error with the message
    // `Couldn't remove agent "${id}": Not found`
    removeAgent(id) {
        throw new Error("Not implemented yet");
    }
    // Add the given structure to the simulation and ask it to broadcast
    // its initial state.
    // If a structure with the same ID already exists, throws
    // an Error with the message `Structure "${structure.id}" already exists`
    addStructure(structure) { }
    // Return the structure with the specified id.
    // If no structure with that id exists, throws an Error with the message
    // `Structure ${id} not found`
    getStructure(id) {
        throw new Error("Not implemented yet");
    }
    // Remove the structure with the specified id from the simulation.
    // If no agent with that id exists, throws an Error with the message
    // `Couldn't remove structure "${id}": Not found`
    removeStructure(id) {
        throw new Error("Not implemented yet");
    }
    // Subscribe the given view to recieve updates from the model
    attach(view) { }
    // Unsubscribe the given view to recieve updates from the model
    detach(view) { }
}
//# sourceMappingURL=model.js.map