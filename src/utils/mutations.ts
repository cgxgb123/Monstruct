import { gql } from '@apollo/client';

export const GET_POKEMON = gql`
  query GetPokemon($name: String!) {
    getPokemon(name: $name) {
      name
      spriteUrl
    }
  }
`;

export const GET_TEAM_BY_ID = gql`
  query GetTeamById($teamId: ID!) {
    getTeam(teamId: $teamId) {
      _id
      teamName
      format
      members {
        species
        nickname
        shiny
        gender
        level
        item
        ability
        nature
        teraType
        moves
        evs {
          hp
          atk
          def
          spa
          spd
          spe
        }
        ivs {
          hp
          atk
          def
          spa
          spd
          spe
        }
      }
    }
  }
`;
export const GET_MOVE_DETAILS = gql`
  query GetMoveDetails($name: String!) {
    getMove(name: $name) {
      name
      power
      accuracy
      pp
      type
      damageClass
    }
  }
`;

export const DELETE_TEAM = gql`
  mutation DeleteTeam($teamId: ID!) {
    removeTeam(teamId: $teamId) {
      _id
      username
      teams {
        _id
        teamName
        format
        members {
          species
          item
          ability
        }
      }
    }
  }
`;

export const UPDATE_TEAM = gql`
  mutation UpdateTeam(
    $teamId: ID!
    $teamName: String!
    $format: String!
    $members: [TeamMemberInput]!
  ) {
    updateTeam(
      teamId: $teamId
      teamName: $teamName
      format: $format
      members: $members
    ) {
      _id
      teamName
    }
  }
`;
export const SAVE_TEAM = gql`
  mutation SaveTeam(
    $teamName: String!
    $format: String!
    $members: [TeamMemberInput]!
  ) {
    saveTeam(teamName: $teamName, format: $format, members: $members) {
      _id
      teamName
      format
      members {
        species
        ability
        item
      }
    }
  }
`;

export const GET_MY_TEAMS = gql`
  query GetMyTeams {
    me {
      _id
      username
      teams {
        _id
        teamName
        format
        members {
          species
          nickname
          shiny
          item
          ability
          nature
          teraType
          moves
          evs {
            hp
            atk
            def
            spa
            spd
            spe
          }
          ivs {
            hp
            atk
            def
            spa
            spd
            spe
          }
        }
      }
    }
  }
`;

export const SEARCH_NAMES = gql`
  query Search($name: String!) {
    search(name: $name) {
      name
      displayName
      sprite
      fallbackSprite
    }
  }
`;

export const SIGNUP = gql`
  mutation signup($username: String!, $email: String!, $password: String!) {
    signup(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;
