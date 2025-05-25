<template>
  <div class="voting-records">
    <h2>投票紀錄</h2>
    <table>
      <thead>
        <tr>
          <th>投票人</th>
          <th>投票項目</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="record in votingHistories"
          :key="record.voter + '-' + record.votingItemName"
        >
          <td>{{ record.voter }}</td>
          <td>投票選項 ： {{ record.votingItemName }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const votingHistories = ref([]);

onMounted(() => {
  fetch("http://localhost:8080/api/getAllVotingHistories")
    .then((response) => response.json())
    .then((data) => {
      votingHistories.value = data;
    })
    .catch((err) => {
      console.error("取得投票紀錄失敗：", err);
    });
});
</script>

<style scoped>
.voting-records {
  margin: 1rem auto;
  max-width: 600px;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}
th,
td {
  border: 1px solid #ccc;
  padding: 0.5rem;
  text-align: center;
}
thead {
  background-color: #f4f4f4;
}
</style>
