let ioInstance;

export function registerSocket(io) {
  ioInstance = io;
}

export function emitDashboardUpdated() {
  if (ioInstance) {
    ioInstance.emit("dashboardUpdated");
  }
}
