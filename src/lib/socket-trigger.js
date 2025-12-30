export async function triggerSocketUpdate() {
    try {
        if (typeof global !== 'undefined' && global.io) {
            global.io.emit('OCCUPANCY_UPDATE', { timestamp: Date.now() });
            console.log('Direct socket trigger successful');
            return;
        }
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        await fetch(`${baseUrl}/api/trigger-update`, {
            method: 'POST',
            body: JSON.stringify({ event: 'OCCUPANCY_UPDATE' }),
            headers: { 'Content-Type': 'application/json' }
        });
        console.log('API socket trigger successful');
    } catch (error) {
        console.error('Failed to trigger socket update:', error);
    }
}
