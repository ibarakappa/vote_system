import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import VotingManagement from "@/components/VotingManagement.vue";
import UserVoting from "@/components/UserVoting.vue"; // 引入 UserVoting 組件
import VotingRecords from "@/components/VotingRecords.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/manage", component: VotingManagement },
  { path: "/vote", component: UserVoting }, // 新增 UserVoting 的路由
  { path: "/records", component: VotingRecords },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
