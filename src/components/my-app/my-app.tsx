import '@ionic/core';
import '@stencil/core';
import { Component, Prop, Listen } from '@stencil/core';
import { ToastController } from '@ionic/core';

import ApolloClient from "apollo-boost";
import gql from "graphql-tag";

@Component({
  tag: 'my-app',
  styleUrl: 'my-app.scss'
})
export class MyApp {

  @Prop({ connect: 'ion-toast-controller' }) toastCtrl: ToastController;

  client = new ApolloClient({
    uri: "https://w5xlvm3vzz.lp.gql.zone/graphql"
  });

  componentDidLoad() {
    /*
      Handle service worker updates correctly.
      This code will show a toast letting the
      user of the PWA know that there is a 
      new version available. When they click the
      reload button it then reloads the page 
      so that the new service worker can take over
      and serve the fresh content
    */
    window.addEventListener('swUpdate', () => {
      this.toastCtrl.create({
        message: 'New version available',
        showCloseButton: true,
        closeButtonText: 'Reload'
      }).then((toast) => {
        toast.present();
      });
    })

    this.client
  .query({
    query: gql`
      {
        rates(currency: "USD") {
          currency
        }
      }
    `
  })
  .then(data => console.log({ data }));
  }

  @Listen('body:ionToastWillDismiss')
  reload() {
    window.location.reload();
  }

  render() {
    return (
      <ion-app>
        <main>
          <ion-router useHash={false}>
            <ion-route url='/' component='app-home'></ion-route>
            <ion-route url='/profile/:name' component='app-profile'></ion-route>

            <ion-nav></ion-nav>
          </ion-router>
        </main>
      </ion-app>
    );
  }
}
