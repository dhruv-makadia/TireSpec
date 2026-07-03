import * as signalR from '@microsoft/signalr';

const HUB_URL = import.meta.env.VITE_SIGNALR_HUB_URL || 'http://localhost:5001/hubs/capture';

/**
 * Create and manage a SignalR connection to the CaptureHub.
 */
export const createCaptureConnection = () => {
  const connection = new signalR.HubConnectionBuilder()
    .withUrl(HUB_URL)
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Warning)
    .build();

  return connection;
};

/**
 * Join a capture session group.
 * @param {signalR.HubConnection} connection
 * @param {string} sessionId
 */
export const joinSession = async (connection, sessionId) => {
  await connection.invoke('JoinSession', sessionId);
};

/**
 * Leave a capture session group.
 * @param {signalR.HubConnection} connection
 * @param {string} sessionId
 */
export const leaveSession = async (connection, sessionId) => {
  await connection.invoke('LeaveSession', sessionId);
};

/**
 * Submit a captured photo to the session.
 * @param {signalR.HubConnection} connection
 * @param {string} sessionId
 * @param {string} imageDataUrl
 */
export const submitPhoto = async (connection, sessionId, imageDataUrl) => {
  await connection.invoke('SubmitPhoto', sessionId, imageDataUrl);
};

/**
 * Register a callback for capture status updates.
 * @param {signalR.HubConnection} connection
 * @param {function} callback - receives { sessionId, status, connectionId }
 */
export const onCaptureStatus = (connection, callback) => {
  connection.on('CaptureStatus', callback);
};

/**
 * Register a callback for tire photo captured events.
 * @param {signalR.HubConnection} connection
 * @param {function} callback - receives { sessionId, imageDataUrl, capturedAt }
 */
export const onTirePhotoCaptured = (connection, callback) => {
  connection.on('TirePhotoCaptured', callback);
};
