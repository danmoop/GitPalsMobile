import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { API_URL } from 'src/variables/constants';
import { AlertController } from '@ionic/angular';
import { Project } from 'src/model/Project';
import { Location } from '@angular/common'
import axios from 'axios';

@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.page.html',
  styleUrls: ['./edit-project.page.scss'],
})
export class EditProjectPage {

  project: Project;

  constructor(
      private router: Router,
      private route: ActivatedRoute, 
      private alertCtrl: AlertController,
      private location: Location
    ) {
    var projectId = route.snapshot.params.id;

    axios.get(`${API_URL}/projects/getById/${projectId}`)
      .then(response => {
        this.project = response.data;
      })
      .catch(err => this.showAlert(err));
  }

  removeTech(tech): void {
    var techIndex = this.project.technologies.indexOf(tech);
    this.project.technologies.splice(techIndex, 1);
  }

  removeRole(role): void {
    var roleIndex = this.project.requiredRoles.indexOf(role);
    this.project.requiredRoles.splice(roleIndex, 1);
  }

  addTech(): void {
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

  addRole(): void {
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

  save(): void {
    axios.post(`${API_URL}/projects/editProject`, {
      project: this.project,
      jwt: localStorage.getItem('jwt')
    })
    .then(response => {
      if(response.data.status == 'OK') {
        this.showAlert('Success!');
        this.location.back();
      }
    })
    .catch(err => this.showAlert(err));
  }

  showAlert(msg): void {
    this.alertCtrl.create({
      header: msg,
      buttons: ['OK']
    }).then(alert => alert.present());
  }
}
