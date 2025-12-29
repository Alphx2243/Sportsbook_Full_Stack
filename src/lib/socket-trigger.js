export async function triggerSocketUpdate() {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        await fetch(`${baseUrl}/api/trigger-update`, {
            method: 'POST',
            body: JSON.stringify({ event: 'OCCUPANCY_UPDATE' })
        });
    } catch (error) {
        console.error('Failed to trigger socket update:', error);
    }
}
