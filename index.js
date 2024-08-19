document.addEventListener("DOMContentLoaded", function() {
    const API_URL = 'https://ddragon.leagueoflegends.com/cdn/13.1.1/data/en_US/champion.json';
    const championContainer = document.getElementById('championContainer');
    const searchBar = document.getElementById('searchBar');
    const roleDropdown = document.getElementById('roleDropdown');

    fetch(API_URL)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            const champions = Object.values(data.data);
            displayChampions(champions);

            searchBar.addEventListener('input', function(e) {
                const searchValue = e.target.value.toLowerCase();
                const filteredChampions = champions.filter(function(champion) {
                    return champion.name.toLowerCase().includes(searchValue);
                });
                displayChampions(filteredChampions);
            });

            roleDropdown.addEventListener('change', function(e) {
                const selectedRole = e.target.value;
                let filteredChampions = champions;

                if (selectedRole !== 'all') {
                    filteredChampions = champions.filter(function(champion) {
                        return champion.tags.includes(selectedRole);
                    });
                }

                displayChampions(filteredChampions);
            });
        })
        .catch(function(error) {
            console.error('Error fetching data:', error);
        });

    function displayChampions(champions) {
        championContainer.innerHTML = '';

        champions.forEach(function(champion) {
            const championCard = document.createElement('div');
            championCard.classList.add('ch-card');
            championCard.innerHTML = `
                <img src="https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion.id}_0.jpg" alt="${champion.name}">
                <h3>${champion.name}</h3>
                <p>${champion.title}</p>
            `;

            championCard.setAttribute('data-id', champion.id);

            championCard.addEventListener('click', function() {
                showAbilities(champion.id);
            });

            championContainer.appendChild(championCard);
        });
    }

    function showAbilities(championId) {
        const CHAMPION_DETAILS_URL = `https://ddragon.leagueoflegends.com/cdn/13.1.1/data/en_US/champion/${championId}.json`;

        fetch(CHAMPION_DETAILS_URL)
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                const championData = data.data[championId];
                const abilities = championData.spells.map(function(spell) {
                    return spell.name + ": " + spell.description;
                });

                const abilitiesList = document.createElement('ul');
                abilitiesList.classList.add('abilities-list');

                abilities.forEach(function(ability) {
                    const listItem = document.createElement('li');
                    listItem.textContent = ability;
                    abilitiesList.appendChild(listItem);
                });

                const existingAbilitiesList = document.querySelector('.abilities-list');
                if (existingAbilitiesList) {
                    existingAbilitiesList.remove();
                }

                const championCard = championContainer.querySelector(`[data-id='${championId}']`);
                championCard.appendChild(abilitiesList);
            })
            .catch(function(error) {
                console.error('Error fetching champion details:', error);
            });
    }
});
