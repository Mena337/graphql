const renderSkills = (skills) => {
    const relevantSkills = ['skill_back-end', 'skill_front-end', 'skill_algo', 'skill_prog'];
    const maxSkills = {};

    skills.forEach(skill => {
        if (relevantSkills.includes(skill.type)) {
            if (!maxSkills[skill.type] || skill.amount > maxSkills[skill.type]) {
                maxSkills[skill.type] = skill.amount;
            }
        }
    });

    const idata = Object.keys(maxSkills).map(skillType => {
        return {
            value: maxSkills[skillType],
            name: skillType
        };
    });

    var colors = ['#00cc88', '#cc8800', '#0088cc', '#cc0088', '#cc0199'];

    idata.forEach(function(item, index) {
        var percentage = item.value;
        var α = (percentage / 100) * 360;  
        var π = Math.PI;
        var r = (α * π / 180);  
        var x = Math.sin(r) * 125;  
        var y = Math.cos(r) * -125;  
        var mid = (α > 180) ? 1 : 0;
        var anim = 'M 0 0 v -125 A 125 125 1 ' + mid + ' 1 ' + x + ' ' + y + ' z';

        var loader = document.createElementNS("http://www.w3.org/2000/svg", "path");
        loader.setAttribute('d', anim);
        loader.setAttribute('fill', colors[index % colors.length]);
        loader.setAttribute('transform', `translate(125, 125) scale(${1 - (index * 0.15)})`);
        document.getElementById('svg-container').appendChild(loader);
    });

    idata.forEach(function(item, index) {
        var label = document.createElement("div");
        label.style.color = colors[index % colors.length]; 
        label.style.margin = "5px"; 
        label.textContent = `${item.name}: ${item.value}%`;
        document.getElementById('labels-container').appendChild(label);
    });
};