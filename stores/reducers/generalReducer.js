const initState = {
    adminNav: [
        {
            title: "Profile",
            link: "/en/admin/profile"
        },
        {
            title: "Clients",
            link: "/en/admin/clients"
        },
        {
            title: "Suppliers",
            link: "/en/admin/suppliers"
        },
        {
            title: "Moderators",
            link: "/en/admin/moderators"
        },
        {
            title: "Brands",
            link: "/en/admin/brands"
        },
        {
            title: "Requests",
            link: "/en/admin/requests"
        },
        {
            title: "Go To Website",
            link: "/en/"
        },
    
    ],
    moderatorNav: [
        {
            title: "Profile",
            link: "/en/moderator/profile"
        },
        {
            title: "Clients",
            link: "/en/moderator/clients"
        },
        {
            title: "Suppliers",
            link: "/en/moderator/suppliers"
        },
        {
            title: "Brands",
            link: "/en/moderator/brands"
        },
        {
            title: "Requests",
            link: "/en/moderator/requests"
        },
        {
            title: "Go To Website",
            link: "/en/"
        },
    
    ],

    BAR_COLORS: [
        "rgba(255, 99, 112, 0.3)",
        "rgba(255, 159, 64, 0.3)",
        "rgba(255, 205, 86, 0.3)",
        "rgba(75, 192, 192, 0.3)",
        "rgba(54, 162, 235, 0.3)",
        "rgba(153, 102, 255, 0.3)",
        "rgba(201, 203, 207, 0.3)",
    ],
      

    ENDPOINT: "http://localhost:8000/api"
}


const generalReducer = (state=initState, action) => {
    switch (action.type) {
        default:
            return state;
    }
}


export default generalReducer;
