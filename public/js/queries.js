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
        throw new Error('JWT token not found in localStorage');
    }
    try {
        const data = await GraphqlData(token, query1);
        const user = data.data.user[0];

        document.getElementById("userId").textContent = `ID: ${user.id}`;
        document.getElementById("userName").textContent = `Name: ${user.firstName} ${user.lastName}`;
        document.getElementById("userLogin").textContent = `Login: ${user.login}`;
        document.getElementById("userEmail").textContent = `Email: ${user.email}`;
        
        // Progress Rendering
        const pro = data.data.progress;
        const progressContainer = document.querySelector('.progress');
        pro.forEach(progress => {
            const progressElement = document.createElement('div');
            progressElement.innerHTML = `
                <h1>Path: ${progress.path}</h1>
                <h1>Created At: ${progress.createdAt}</h1>
                <h1>Updated At: ${progress.updatedAt}</h1>
                <h1>Grade: ${progress.grade}</h1>
                <hr>
            `;
            progressContainer.appendChild(progressElement);
        });

        // Transactions Rendering
        const tra = data.data.transaction;
        const TprogressContainer = document.querySelector('.transaction');
        tra.forEach(transaction => {
            const progressElement = document.createElement('div');
            progressElement.innerHTML = `
                <h1>Object ID: ${transaction.objectId}</h1>
                <h1>Created At: ${transaction.createdAt}</h1>
                <h1>Type: ${transaction.type}</h1>
                <h1>User ID: ${transaction.userId}</h1>
                <hr>
            `;
            TprogressContainer.appendChild(progressElement);
        });

        // Skills and Audits Logic
        const skillsData = await GraphqlData(token, query_skills);
        const auditRatio = user.auditRatio.toFixed(1);
        renderSkills(skillsData.data.transaction);
        renderAudits(user);

    } catch (error) {
        console.error("Error fetching user data:", error);
        alert("Failed to load user information.");
    }
});
