import Vue from 'vue'
import AiView from '@/components/AiView'

describe('AiView.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(AiView)
    const vm = new Constructor().$mount()
    expect(vm.$el.querySelector('.hello h1').textContent)
      .toEqual('Welcome to Your Vue.js App')
  })
})
