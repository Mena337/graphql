const query_skills = `{
    transaction(
      where: {
          type: {
              _like: "%skill_%"
          }
      }
  ) {
      amount
      type
  }
}`;



const query1 = `{
    user {
      id
      firstName
      lastName
      login
      email
      auditRatio
      totalUp
      totalDown
  }
        progress(order_by: {createdAt: desc}) {
      path
      createdAt
      updatedAt
      grade
    }
        transaction(order_by: {createdAt: desc}){
      objectId
      createdAt
      type
      amount
      userId
    }
      event_user(where: { eventId: { _in: [72, 20, 250] } }  order_by: { level: desc } ) {
      level
      userId
      userLogin
      eventId
    }

      }`;

const GraphqlData = async (token, query) => {
    const dapi = "https://learn.reboot01.com/api/graphql-engine/v1/graphql";

    const response = await fetch(dapi, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ query })
    });

    if (!response.ok) {
        throw new Error('GraphQL query failed: ' + response.statusText);
    }

    const data = await response.json();
    if (data.errors) {
        console.error("GraphQL errors: ", data.errors);
        throw new Error('GraphQL errors: ' + JSON.stringify(data.errors));
    }
    return data;
};

document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
        alert("you have to login")
        window.location.href = "login.html";
        throw new Error('JWT token not found in localStorage');
    }
    try {
        const data = await GraphqlData(token, query1);
        const user = data.data.user[0];

        document.getElementById("userId").textContent = `ID: ${user.id}`;
        document.getElementById("userName").textContent = `Name: ${user.firstName} ${user.lastName}`;
        document.getElementById("userLogin").textContent = `Login: ${user.login}`;
        document.getElementById("userEmail").textContent = `Email: ${user.email}`;

        //Top 6 Event Users
        const eventUsers = data.data.event_user;
        const top3EventUsers = eventUsers.slice(0,6);

        const list = document.getElementById('event-users-list');
        top3EventUsers.forEach(user => {
            
            const listItem = document.createElement('li');
            listItem.className = 'event-user-item';
            listItem.textContent = `User: ${user.userLogin}, Level: ${user.level}`;
            list.appendChild(listItem);
        });

        // Skills and Audits Logic
        const skillsData = await GraphqlData(token, query_skills);
        renderSkills(skillsData.data.transaction);
        renderAudits(user);

    } catch (error) {
        console.error("Error fetching user data:", error);
        alert("Failed to load user information.");
    }
});



document.getElementById('logoutButton').addEventListener('click', function () {
    localStorage.removeItem('jwtToken');
    window.location.href = "login.html";
    console.log("User logged out");
});



