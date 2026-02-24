export const dashboardConfig = {
    title: "Inventory Command Center",
    version: "v2.1",
    layout: "bento",
    widgets: [
        {
            id: "total_inventory",
            title: "Stock Levels",
            type: "stat",
            icon: "box",
            color: "cyan"
        },
        {
            id: "system_health",
            title: "Network Status",
            type: "status",
            icon: "activity",
            color: "emerald"
        },
        {
            id: "environment",
            title: "Active Node",
            type: "badge",
            icon: "shield",
            color: "slate"
        }
    ]
};
