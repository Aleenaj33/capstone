import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PlayerService } from 'src/app/services/player.service';
import { Player } from 'src/app/models/player';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css']
})
export class DataComponent implements OnInit {
  performanceForm: FormGroup;
  players: Player[] = [];

  constructor(private fb: FormBuilder, private playerService: PlayerService) {
    this.performanceForm = this.fb.group({
      playerId: [{ value: 0, disabled: true }, Validators.required],
      playerName: ['', Validators.required],
      height: [{ value: 0, disabled: true }, Validators.required],
      age: [{ value: 0, disabled: true }, Validators.required],
      weight: [{ value: 0, disabled: false }, Validators.required],
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

  ngOnInit() {
    this.loadPlayers();

    this.performanceForm.get('playerName')?.valueChanges.subscribe(selectedName => {
      if (selectedName) {
        const selectedPlayer = this.players.find(p => p.name === selectedName);
        if (selectedPlayer) {
          this.performanceForm.patchValue({
            playerId: selectedPlayer.playerId,
            height: selectedPlayer.height,
            weight: selectedPlayer.weight,
            age: selectedPlayer.age
          });
        }
      }
    });
  }

  loadPlayers() {
    this.playerService.getAllPlayers().subscribe(
      (players) => {
        this.players = players;
      },
      (error) => {
        console.error('Error loading players:', error);
      }
    );
  }
  onSubmit() {
    if (this.performanceForm.valid) {
      const reportData = this.performanceForm.value;
      const selectedPlayer = this.players.find(p => p.name === reportData.playerName);
      
      if (selectedPlayer) {
        // Create a complete performance report object
        const completeReportData = {
          ...reportData,
          playerId: selectedPlayer.playerId,
          height: selectedPlayer.height,
          age: selectedPlayer.age // Assuming Player model has age field
        };
  
        // First update the player's weight
        if (selectedPlayer.weight !== reportData.weight) {
          this.playerService.updatePlayerWeight(selectedPlayer.playerId, reportData.weight).subscribe(
            () => {
              console.log('Player weight updated successfully');
              selectedPlayer.weight = reportData.weight;
            },
            error => {
              console.error('Error updating player weight:', error);
            }
          );
        }
  
        // Then save the performance report with complete data
        this.playerService.savePerformanceReport(completeReportData).subscribe(
          (response) => {
            console.log('Report saved successfully:', response);
            alert('Performance Report Saved Successfully!');
            this.performanceForm.reset();
            // Re-initialize form with default values
            this.performanceForm.patchValue({
              playerId: 0,
              playerName: '',
              height: 0,
              weight: 0,
              hrv: 0,
              topSpeed: 0,
              caloriesBurned: 0,
              passingAccuracy: 0,
              dribblingSuccessRate: 0,
              shootingAccuracy: 0,
              tacklingSuccessRate: 0,
              crossingAccuracy: 0
            });
          },
          (error) => {
            console.error('Error saving report:', error);
            alert('Failed to save the Performance Report. Please try again.');
          }
        );
      }
    } else {
      alert('Please fill in all required fields.');
    }
  }
}
  
