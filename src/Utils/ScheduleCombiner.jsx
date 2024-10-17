const combineScheduleEntries = (schedule) => {
    const processedSchedule = {};

    for (let day in schedule) {
        processedSchedule[day] = [];
        let prevItem = null;

        schedule[day].forEach((currentItem) => {
            if (
                prevItem &&
                prevItem?.subject === currentItem?.subject &&
                prevItem?.teacher === currentItem?.teacher &&
                prevItem?.room === currentItem?.room &&
                prevItem?.end === currentItem?.start // Consecutive times
            ) {
                // Extend the previous item's time
                prevItem.end = currentItem.end;
            } else {
                // Push the previous item and reset
                if (prevItem) {
                    processedSchedule[day].push(prevItem);
                }
                prevItem = { ...currentItem }; // Start a new block
            }
        });

        // Don't forget to push the last item
        if (prevItem) {
            processedSchedule[day].push(prevItem);
        }
    }

    return processedSchedule;
};

export default combineScheduleEntries;