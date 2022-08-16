/* import { createVNode, render,defineComponent } from "vue";
export default function useMyDialog(option) {
  const props = {
    ...option,
  };
  const vm = createVNode(Dialog, props);
  const container = document.createElement("div");
  render(vm, container);
  document.querySelector("#preview")?.appendChild();
}
 */
// import {createVNode,render} from 'vue'
// import Dialog from '../components/Dialog/Dialog'
export default function useMyDialog(option){
    const props = {
        ...option
    }
    const userCloseFn = option?.onClose;
    props.onClose = () => {
        close(vm);
        userCloseFn ?? userCloseFn();
      };
      function close(vm) {
        vm.component.proxy
        .visible = false;
       
      }
      console.log('电到了')
  //   const vm = createVNode(Dialog,props) 
  //   console.log(vm)
  //   const container = document.createElement("div");
  //   render(vm, container);
  // document.querySelector("#preview")?.appendChild(container.firstElementChild);

}