// text-analyzer.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';

interface AnalysisResult {
  char: string;
  count: number;
}

@Injectable({
  providedIn: 'root',
})
export class TextAnalyzerService {
  private apiUrl = 'http://localhost:8080/api/analyze';

  constructor(private http: HttpClient) {}

  analyzeTextOnline(input: string, mode: 'vowels' | 'consonants'): Observable<AnalysisResult[]> {
    return this.http.get<{ [key: string]: number }>(`${this.apiUrl}`, { params: { mode, input } })
      .pipe(
        map(results => {
          console.log('Server response:', results); 
          if (typeof results !== 'object' || results === null) {
            throw new Error('Invalid response format');
          }
          return Object.entries(results).map(([char, count]) => ({ char, count }));
        }),
        catchError(error => {
          console.error('Error analyzing text online', error);
          throw new Error(error);
        })
      );
  }
  countVowelsAndConsonantsDetailed(input: string, mode: 'vowels' | 'consonants'): AnalysisResult[] {
    const result = new Map<string, number>();
    const chars = input.toLowerCase().split('');

    for (const char of chars) {
      if ((mode === 'vowels' && this.isVowel(char)) || (mode === 'consonants' && this.isConsonant(char))) {
        result.set(char, (result.get(char) || 0) + 1);
      }
    }

    return Array.from(result, ([char, count]) => ({ char, count }));
  }

  private isVowel(char: string): boolean {
    return 'aeiou'.includes(char);
  }

  private isConsonant(char: string): boolean {
    return 'bcdfghjklmnpqrstvwxyz'.includes(char);
  }
}
