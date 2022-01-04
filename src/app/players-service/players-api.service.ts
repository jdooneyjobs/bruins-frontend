import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {API_URL} from '../env';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';


@Injectable()
export class PlayersApiService {

  constructor(private http: HttpClient) {
  }

  test(){
    return this.http.get<JSON>('https://statsapi.web.nhl.com/api/v1/teams/23/stats');
  }

  // GET player info
  getPlayer(id: number): Observable<JSON>{
    return this.http.get<JSON>(`${API_URL}players/${id}`);
  }

  //GET player stat split
  getPlayerStats(id:number): Observable<JSON>{
    return this.http.get<JSON>(`${API_URL}players/${id}/stats`);
  }

  //GET player stat split
  getPlayerStatsByYear(id:number): Observable<JSON>{
    return this.http.get<JSON>(`${API_URL}players/${id}/statsbyyear`);
  }

  //GET all players on team's info
  getPlayersByTeam(teamID: number): Observable<JSON>{
    return this.http.get<JSON>(`${API_URL}allplayers/${teamID}`);
  }

  //GET teams
  getTeams(): Observable<JSON>{
    return this.http.get<JSON>(`${API_URL}teams`);
  }

}