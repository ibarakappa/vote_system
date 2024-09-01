<template>
  <div class="user-voting">
    <h1>投票頁面</h1>

    <div class="form">
      <input
        v-model="voterName"
        placeholder="請輸入你的名字"
        type="text"
        class="input-name"
        @input="sanitizeInput"
      />
    </div>

    <ul class="voting-list">
      <li v-for="(item, index) in votingItems" :key="item.id">
        <label>
          <input
            type="checkbox"
            v-model="selectedItems"
            :value="item.votingItemNo"
          />
          投票選項{{ index + 1 }}. {{ item.votingItemName }} - 票數:
          {{ item.voteCount }}
        </label>
      </li>
    </ul>

    <button
      @click="submitVote"
      :disabled="!voterName || selectedItems.length === 0"
    >
      提交投票
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      voterName: "", // 用戶名
      votingItems: [],
      selectedItems: [], // 用戶選擇的投票項目
    };
  },
  created() {
    this.fetchVotingItems();
  },
  methods: {
    fetchVotingItems() {
      fetch("http://localhost:8080/api/getVotingItemVoteCounts")
        .then((response) => response.json())
        .then((data) => {
          this.votingItems = data.sort(
            (a, b) => a.votingItemNo - b.votingItemNo
          ); // 按編號排序
        })
        .catch((error) => {
          console.error("獲取投票項目和票數時出錯:", error);
        });
    },
    sanitizeInput() {
      this.voterName = this.voterName.replace(/[<>]/g, ""); // 清除潛在的XSS字符
    },
    submitVote() {
      if (!this.voterName) {
        alert("請輸入你的名字");
        return;
      }

      const voteRecords = this.selectedItems.map((itemNo) => ({
        voter: this.voterName,
        votingItemNo: itemNo,
      }));

      fetch("http://localhost:8080/api/createVotingHistory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(voteRecords),
      })
        .then((response) => {
          if (response.ok) {
            alert("投票成功！");
            this.selectedItems = [];
            this.fetchVotingItems(); // 更新票數
          }
        })
        .catch((error) => {
          console.error("提交投票時出錯:", error);
        });
    },
  },
};
</script>

<style scoped>
.user-voting {
  width: 60%;
  margin: auto;
}

.form {
  margin-bottom: 20px;
}

.input-name {
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
}

.voting-list {
  list-style-type: none;
  padding: 0;
}

.voting-list li {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background-color: #0056b3;
}
</style>
