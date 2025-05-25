<template>
  <div class="voting-management">
    <h1>投票管理</h1>

    <div class="form">
      <input
        v-model="newVotingItemNo"
        placeholder="投票項目編號"
        type="number"
        class="short-input"
      />
      <input
        v-model="newVotingItemName"
        placeholder="投票項目名稱"
        type="text"
        class="short-input"
      />
      <button @click="addVotingItem">新增投票項目</button>
    </div>

    <ul class="voting-list">
      <li v-for="item in votingItems" :key="item.id" class="voting-item">
        <span class="item-text"
          >{{ item.votingItemNo }} - {{ item.originalName }}</span
        >
        <input
          v-model="item.editedName"
          placeholder="編輯投票項目名稱"
          class="short-input"
        />
        <button @click="updateVotingItem(item)" :disabled="!item.editedName">
          更新
        </button>
        <button @click="confirmDelete(item.votingItemNo)">刪除</button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      votingItems: [],
      newVotingItemNo: "",
      newVotingItemName: "",
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
          this.votingItems = data
            .map((item) => ({
              ...item,
              originalName: item.votingItemName,
              editedName: item.votingItemName,
            }))
            .sort((a, b) => a.votingItemNo - b.votingItemNo);
        })
        .catch((error) => {
          console.error("獲取投票項目時出錯:", error);
        });
    },
    addVotingItem() {
      if (!this.newVotingItemNo || !this.newVotingItemName) {
        alert("投票項目編號和名稱不能為空白！");
        return;
      }

      const duplicateItem = this.votingItems.find(
        (item) =>
          item.votingItemNo === parseInt(this.newVotingItemNo) ||
          item.votingItemName.trim() === this.newVotingItemName.trim()
      );

      if (duplicateItem) {
        alert("投票項目編號或名稱已存在，請勿重複。");
        return;
      }

      const newItem = {
        votingItemNo: this.newVotingItemNo,
        votingItemName: this.newVotingItemName,
      };

      fetch("http://localhost:8080/api/createVotingItem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newItem),
      })
        .then((response) => response.json())
        .then((data) => {
          this.votingItems.push({
            ...data,
            originalName: data.votingItemName,
            editedName: data.votingItemName,
          });
          this.newVotingItemNo = "";
          this.newVotingItemName = "";
        })
        .catch((error) => {
          console.error("新增投票項目時出錯:", error);
        });
    },
    updateVotingItem(item) {
      if (!item.editedName) return;

      fetch("http://localhost:8080/api/updateVotingItem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...item, votingItemName: item.editedName }),
      })
        .then((response) => {
          if (response.ok) {
            item.originalName = item.editedName;
            alert("投票項目更新成功！");
          }
        })
        .catch((error) => {
          console.error("更新投票項目時出錯:", error);
        });
    },
    confirmDelete(votingItemNo) {
      const confirmed = window.confirm("你確定要刪除此投票項目嗎？");
      if (confirmed) {
        this.deleteVotingItem(votingItemNo);
      }
    },
    deleteVotingItem(votingItemNo) {
      fetch("http://localhost:8080/api/deleteVotingItem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(votingItemNo),
      })
        .then((response) => {
          if (response.ok) {
            this.votingItems = this.votingItems.filter(
              (item) => item.votingItemNo !== votingItemNo
            );
          }
        })
        .catch((error) => {
          console.error("刪除投票項目時出錯:", error);
        });
    },
  },
};
</script>

<style scoped>
.voting-management {
  width: 60%;
  margin: auto;
}

.form {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}

.short-input {
  width: 150px;
}

.voting-list {
  list-style-type: none;
  padding: 0;
}

.voting-list li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid #ddd;
  gap: 10px;
}

.voting-list li .item-text {
  flex-grow: 1;
  text-align: left;
  pointer-events: none; /* 禁用交互 */
}

.voting-list li input {
  width: 150px;
  padding: 5px;
}
</style>
