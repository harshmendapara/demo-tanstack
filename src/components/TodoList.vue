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
@import url('../assets/style.css');
</style>
