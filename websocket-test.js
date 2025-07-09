
const WebSocket = require('ws');

console.log('🔍 Testing WebSocket connection to API Gateway...');

const ws = new WebSocket('ws://192.168.178.63:3000/ws/events');

ws.on('open', function open() {
    console.log('✅ WebSocket connected successfully');
    console.log('Connection time:', new Date().toISOString());
    
    // Send test message
    ws.send('TEST_MESSAGE|node-client|' + Date.now());
    console.log('📤 Test message sent');
});

ws.on('message', function message(data) {
    console.log('📨 Message received:', data.toString());
    console.log('Received at:', new Date().toISOString());
});

ws.on('close', function close(code, reason) {
    console.log('❌ WebSocket closed');
    console.log('Close code:', code);
    console.log('Close reason:', reason.toString());
});

ws.on('error', function error(err) {
    console.error('🚨 WebSocket error:', err.message);
});

// Keep connection open for 60 seconds
setTimeout(() => {
    console.log('🔍 Test completed, closing connection');
    ws.close();
}, 60000);


