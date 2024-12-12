import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PlayerService } from 'src/app/services/player.service';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css']
})
export class DataComponent {
  performanceForm: FormGroup;

  constructor(private fb: FormBuilder,private playerservice:PlayerService) {
    // Initialize the form
    this.performanceForm = this.fb.group({
      playerId: [0, Validators.required],
      playerName: ['', Validators.required],
      age: [0, Validators.required],
      weight: [0, Validators.required],
      recordDate: ['', Validators.required],
      hrv: [0, Validators.required],
      topSpeed: [0, Validators.required],
      caloriesBurned: [0, Validators.required],
      passingAccuracy: [0, Validators.required],
      dribblingSuccessRate: [0, Validators.required],
      shootingAccuracy: [0, Validators.required],
      tacklingSuccessRate: [0, Validators.required],
      crossingAccuracy: [0, Validators.required]
    });
  }

  onSubmit() {
    if (this.performanceForm.valid) {
      const reportData = this.performanceForm.value;

      this.playerservice.savePerformanceReport(reportData).subscribe(
        (response) => {
          console.log('Report saved successfully:', response);
          alert('Performance Report Saved Successfully!');
        },
        (error) => {
          console.error('Error saving report:', error);
          alert('Failed to save the Performance Report. Please try again.');
        }
      );
    } else {
      alert('Please fill in all required fields.');
    }
  }
}
