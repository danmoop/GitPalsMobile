import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { API_URL } from 'src/variables/constants';
import axios from 'axios';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.page.html',
  styleUrls: ['./edit-project.page.scss'],
})
export class EditProjectPage {

  project: any;

  constructor(private route: ActivatedRoute, private alertCtrl: AlertController) {
    var projectId = route.snapshot.params.id;

    axios.get(`${API_URL}/projects/getById/${projectId}`)
      .then(response => {
        this.project = response.data;
      });
  }

  removeTech(tech) {
    var techIndex = this.project.technologies.indexOf(tech);
    this.project.technologies.splice(techIndex, 1);
  }

  removeRole(role) {
    var roleIndex = this.project.requiredRoles.indexOf(role);
    this.project.requiredRoles.splice(roleIndex, 1);
  }

  addTech() {
    this.alertCtrl.create({
      header: 'Add Technology',
      inputs: [
        {
          name: 'tech',
          placeholder: 'Technology'
        }
      ],
      buttons: [
        {
          text: 'Add',
          handler: (data) => {
            this.project.technologies.push(data.tech);
          }
        }
      ]
    }).then(alert => alert.present());
  }

  addRole() {
    this.alertCtrl.create({
      header: 'Add Role',
      inputs: [
        {
          name: 'role',
          placeholder: 'Role'
        }
      ],
      buttons: [
        {
          text: 'Add',
          handler: (data) => {
            this.project.requiredRoles.push(data.role);
          }
        }
      ]
    }).then(alert => alert.present());
  }

  save() {
    axios.post(`${API_URL}/projects/editProject`, {
      project: this.project,
      jwt: localStorage.getItem('jwt')
    }).then(response => {
      if(response.data.status == 'OK') {
        this.showAlert('Success!');
      }
    })
  }

  showAlert(msg) {
    this.alertCtrl.create({
      header: msg,
      buttons: ['OK']
    }).then(alert => alert.present());
  }
}