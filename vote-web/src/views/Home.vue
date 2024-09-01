<template>
  <div>
    <h1>投票系統</h1>

    <div class="actions">
      <router-link to="/vote">
        <button>投票</button>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      votingItems: [],
    };
  },
  created() {
    this.fetchVotingItems();
  },
  methods: {
    fetchVotingItems() {
      fetch("http://localhost:8080/api/getAllVotingItems")
        .then((response) => response.json())
        .then((data) => {
          this.votingItems = data;
        })
        .catch((error) => {
          console.error("Error fetching voting items:", error);
        });
    },
  },
};
</script>

<style scoped>
.voting-items-section {
  margin-bottom: 20px;
}

.actions {
  display: flex;
  gap: 10px;
}

button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
