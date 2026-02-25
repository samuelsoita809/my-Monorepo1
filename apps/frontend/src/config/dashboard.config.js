export const dashboardConfig = {
    title: "Inventory Command Center",
    version: "v2.1",
    layout: "bento",
    widgets: [
        {
            id: "total_inventory",
            title: "Total Products",
            type: "stat",
            icon: "box",
            color: "slate"
        },
        {
            id: "low_stock",
            title: "Low Stock Alert",
            type: "warning",
            icon: "alert",
            color: "rose"
        },
        {
            id: "categories_count",
            title: "Categories",
            type: "stat",
            icon: "tag",
            color: "indigo"
        }
    ]
};
