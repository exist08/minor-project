export const formatDueDate = (dueDate) => {
    const date = new Date(dueDate);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Calculate days remaining
    const daysRemaining = Math.ceil((date - today) / (1000 * 60 * 60 * 24));

    // Format the date
    const formattedDate = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    // Determine status and color
    let status;
    let statusColor;
    if (daysRemaining < 0) {
        status = 'Overdue';
        statusColor = 'text-red-800';
    } else if (daysRemaining === 0) {
        status = 'Due Today';
        statusColor = 'text-yellow-800';
    } else if (daysRemaining === 1) {
        status = 'Due Tomorrow';
        statusColor = 'text-orange-800';
    } else {
        status = `${daysRemaining} days left`;
        statusColor = 'text-green-800';
    }

    return { formattedDate, status, statusColor };
};