import { Component } from '@angular/core';
import { TextAnalyzerService } from './text-analyzer.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';

interface AnalysisResult {
  char: string;
  count: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class AppComponent {
  userInput: string = '';
  resultHistory: { mode: string; results: AnalysisResult[] }[] = [];
  isOnline: boolean = false;

  constructor(private textAnalyzerService: TextAnalyzerService) {}

  analyzeText(mode: 'vowels' | 'consonants') {
    let result: AnalysisResult[];

    if (this.isOnline) {
      this.analyzeTextOnline(this.userInput, mode).subscribe(
        (res) => {
          result = res;
          this.updateResults(result, mode);
        },
        (error) => {
          console.error('Error analyzing text online', error);
        }
      );
    } else {
      result = this.textAnalyzerService.countVowelsAndConsonantsDetailed(this.userInput, mode);
      this.updateResults(result, mode);
    }
  }

  toggleMode() {
    this.isOnline = !this.isOnline;
    console.log('Mode toggled to', this.isOnline ? 'online' : 'offline');
  }

  updateResults(results: AnalysisResult[], mode: 'vowels' | 'consonants') {
    this.resultHistory.push({ mode: mode.charAt(0).toUpperCase() + mode.slice(1), results });
  }

  analyzeTextOnline(input: string, mode: 'vowels' | 'consonants'): Observable<AnalysisResult[]> {

    return this.textAnalyzerService.analyzeTextOnline(input, mode);
  }
}
