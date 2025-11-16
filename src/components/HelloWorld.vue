<template>
  <div class="app-container">
    <div class="header">Todo List</div>
    <div ref="scrollBox" class="scroll-container">
      <ul class="todo-list">
        <li v-for="todo in allTodos" :key="todo.id" class="todo-card">
          <div class="todo-id">{{ todo.id }}</div>
          <div class="todo-title">{{ todo.title }}</div>
          <div class="todo-status" :class="{ completed: todo.completed }">
            {{ todo.completed ? 'Completed' : 'Pending' }}
          </div>
        </li>
      </ul>
      <div ref="loadMoreTrigger" class="loader">
        <span v-if="isFetchingNextPage">Loading more...</span>
        <span v-else-if="!hasNextPage">No more todos</span>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useInfiniteQuery } from '@tanstack/vue-query'

const scrollBox = ref(null)
const loadMoreTrigger = ref(null)

const fetchTodos = async ({ pageParam = 1 }) => {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/todos?_page=${pageParam}&_limit=15`
  )
  return res.json()
}

const {
  data,
  fetchNextPage,
  isFetchingNextPage,
  hasNextPage,
} = useInfiniteQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
  getNextPageParam: (lastPage, pages) => {
    if (lastPage.length < 15) return undefined
    return pages.length + 1
  },
})

const allTodos = computed(() => data?.value?.pages?.flat() || [])

onMounted(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && hasNextPage.value && !isFetchingNextPage.value) {
        fetchNextPage()
      }
    },
    { root: scrollBox.value, threshold: 1.0 }
  )

  if (loadMoreTrigger.value) observer.observe(loadMoreTrigger.value)
})
</script>

<style>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f9f9f9;
  margin: 0;
}

.header {
  position: sticky;
  top: 0;
  background-color: #4a90e2;
  color: white;
  padding: 16px;
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  z-index: 10;
}
.scroll-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}
.todo-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  list-style: none;
  padding: 0;
  margin: 0;
}
.todo-card {
  background-color: white;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: transform 0.2s;
}
.todo-card:hover {
  transform: translateY(-2px);
}
.todo-id {
  font-weight: bold;
  color: #4a90e2;
  margin-right: 12px;
}
.todo-title {
  flex: 1;
  margin-right: 12px;
  font-size: 16px;
}
.todo-status {
  font-weight: bold;
  padding: 4px 8px;
  border-radius: 8px;
  text-transform: uppercase;
  font-size: 12px;
  color: white;
}
.todo-status.completed {
  background-color: #28a745;
}
.todo-status:not(.completed) {
  background-color: #dc3545;
}
.loader {
  text-align: center;
  padding: 16px;
  font-weight: bold;
  color: #4a90e2;
}
</style>
