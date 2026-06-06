import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CurrentUserServiceService } from 'src/app/services/utils/current-user-service/current-user-service.service';

@Component({
  selector: 'app-empty',
  templateUrl: './empty.component.html',
  styleUrl: './empty.component.scss',
})
export class EmptyComponent implements OnInit {
  constructor(private currentUserService: CurrentUserServiceService, private router: Router) {}
  ngOnInit(): void {

  }
}
