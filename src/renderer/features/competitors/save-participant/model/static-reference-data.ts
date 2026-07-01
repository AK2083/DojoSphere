/** Static reference data aligned with SQLite seed migrations (V004–V007). */
/* eslint-disable jsdoc/require-jsdoc -- generated seed constants */

export type AgeClassSeed = {
  id: string
  djbRow: number
  gender: 'f' | 'm'
  competitionForm: 'individual' | 'team'
  labelKey: string
  weightMode: 'fixed' | 'flexible'
}

export type GradeSeed = {
  id: string
  gradeType: 'k' | 'd'
  level: number
  labelKey: string
  sortOrder: number
}

export type WeightClassSeed = {
  id: string
  djbRow: number
  ageClassId: string
  maxWeightKg: number | null
  minWeightKg: number | null
  sortOrder: number
}

export type ClubSeed = {
  id: string
  nameKey: string
}

export const AGE_CLASS_SEEDS: AgeClassSeed[] = [
  {
    id: 'c2000000-0000-4000-8000-000000000001',
    djbRow: 1,
    gender: 'm',
    competitionForm: 'individual',
    labelKey: 'ageClasses.djb2025.row01',
    weightMode: 'flexible'
  },
  {
    id: 'c2000000-0000-4000-8000-000000000002',
    djbRow: 2,
    gender: 'm',
    competitionForm: 'individual',
    labelKey: 'ageClasses.djb2025.row02',
    weightMode: 'flexible'
  },
  {
    id: 'c2000000-0000-4000-8000-000000000003',
    djbRow: 3,
    gender: 'm',
    competitionForm: 'individual',
    labelKey: 'ageClasses.djb2025.row03',
    weightMode: 'fixed'
  },
  {
    id: 'c2000000-0000-4000-8000-000000000004',
    djbRow: 4,
    gender: 'm',
    competitionForm: 'team',
    labelKey: 'ageClasses.djb2025.row04',
    weightMode: 'fixed'
  },
  {
    id: 'c2000000-0000-4000-8000-000000000005',
    djbRow: 5,
    gender: 'm',
    competitionForm: 'individual',
    labelKey: 'ageClasses.djb2025.row05',
    weightMode: 'fixed'
  },
  {
    id: 'c2000000-0000-4000-8000-000000000006',
    djbRow: 6,
    gender: 'm',
    competitionForm: 'team',
    labelKey: 'ageClasses.djb2025.row06',
    weightMode: 'fixed'
  },
  {
    id: 'c2000000-0000-4000-8000-000000000007',
    djbRow: 7,
    gender: 'm',
    competitionForm: 'individual',
    labelKey: 'ageClasses.djb2025.row07',
    weightMode: 'fixed'
  },
  {
    id: 'c2000000-0000-4000-8000-000000000008',
    djbRow: 8,
    gender: 'm',
    competitionForm: 'individual',
    labelKey: 'ageClasses.djb2025.row08',
    weightMode: 'fixed'
  },
  {
    id: 'c2000000-0000-4000-8000-000000000009',
    djbRow: 9,
    gender: 'm',
    competitionForm: 'team',
    labelKey: 'ageClasses.djb2025.row09',
    weightMode: 'fixed'
  },
  {
    id: 'c2000000-0000-4000-8000-00000000000a',
    djbRow: 10,
    gender: 'f',
    competitionForm: 'individual',
    labelKey: 'ageClasses.djb2025.row10',
    weightMode: 'flexible'
  },
  {
    id: 'c2000000-0000-4000-8000-00000000000b',
    djbRow: 11,
    gender: 'f',
    competitionForm: 'individual',
    labelKey: 'ageClasses.djb2025.row11',
    weightMode: 'flexible'
  },
  {
    id: 'c2000000-0000-4000-8000-00000000000c',
    djbRow: 12,
    gender: 'f',
    competitionForm: 'individual',
    labelKey: 'ageClasses.djb2025.row12',
    weightMode: 'fixed'
  },
  {
    id: 'c2000000-0000-4000-8000-00000000000d',
    djbRow: 13,
    gender: 'f',
    competitionForm: 'team',
    labelKey: 'ageClasses.djb2025.row13',
    weightMode: 'fixed'
  },
  {
    id: 'c2000000-0000-4000-8000-00000000000e',
    djbRow: 14,
    gender: 'f',
    competitionForm: 'individual',
    labelKey: 'ageClasses.djb2025.row14',
    weightMode: 'fixed'
  },
  {
    id: 'c2000000-0000-4000-8000-00000000000f',
    djbRow: 15,
    gender: 'f',
    competitionForm: 'team',
    labelKey: 'ageClasses.djb2025.row15',
    weightMode: 'fixed'
  },
  {
    id: 'c2000000-0000-4000-8000-000000000010',
    djbRow: 16,
    gender: 'f',
    competitionForm: 'individual',
    labelKey: 'ageClasses.djb2025.row16',
    weightMode: 'fixed'
  },
  {
    id: 'c2000000-0000-4000-8000-000000000011',
    djbRow: 17,
    gender: 'f',
    competitionForm: 'individual',
    labelKey: 'ageClasses.djb2025.row17',
    weightMode: 'fixed'
  },
  {
    id: 'c2000000-0000-4000-8000-000000000012',
    djbRow: 18,
    gender: 'f',
    competitionForm: 'team',
    labelKey: 'ageClasses.djb2025.row18',
    weightMode: 'fixed'
  }
]

export const GRADE_SEEDS: GradeSeed[] = [
  {
    id: 'a1000000-0000-4000-8000-000000000001',
    gradeType: 'k',
    level: 10,
    labelKey: 'grades.k.10',
    sortOrder: 1
  },
  {
    id: 'a1000000-0000-4000-8000-000000000002',
    gradeType: 'k',
    level: 9,
    labelKey: 'grades.k.9',
    sortOrder: 2
  },
  {
    id: 'a1000000-0000-4000-8000-000000000003',
    gradeType: 'k',
    level: 8,
    labelKey: 'grades.k.8',
    sortOrder: 3
  },
  {
    id: 'a1000000-0000-4000-8000-000000000004',
    gradeType: 'k',
    level: 7,
    labelKey: 'grades.k.7',
    sortOrder: 4
  },
  {
    id: 'a1000000-0000-4000-8000-000000000005',
    gradeType: 'k',
    level: 6,
    labelKey: 'grades.k.6',
    sortOrder: 5
  },
  {
    id: 'a1000000-0000-4000-8000-000000000006',
    gradeType: 'k',
    level: 5,
    labelKey: 'grades.k.5',
    sortOrder: 6
  },
  {
    id: 'a1000000-0000-4000-8000-000000000007',
    gradeType: 'k',
    level: 4,
    labelKey: 'grades.k.4',
    sortOrder: 7
  },
  {
    id: 'a1000000-0000-4000-8000-000000000008',
    gradeType: 'k',
    level: 3,
    labelKey: 'grades.k.3',
    sortOrder: 8
  },
  {
    id: 'a1000000-0000-4000-8000-000000000009',
    gradeType: 'k',
    level: 2,
    labelKey: 'grades.k.2',
    sortOrder: 9
  },
  {
    id: 'a1000000-0000-4000-8000-00000000000a',
    gradeType: 'k',
    level: 1,
    labelKey: 'grades.k.1',
    sortOrder: 10
  },
  {
    id: 'a1000000-0000-4000-8000-00000000000b',
    gradeType: 'd',
    level: 1,
    labelKey: 'grades.d.1',
    sortOrder: 11
  },
  {
    id: 'a1000000-0000-4000-8000-00000000000c',
    gradeType: 'd',
    level: 2,
    labelKey: 'grades.d.2',
    sortOrder: 12
  },
  {
    id: 'a1000000-0000-4000-8000-00000000000d',
    gradeType: 'd',
    level: 3,
    labelKey: 'grades.d.3',
    sortOrder: 13
  },
  {
    id: 'a1000000-0000-4000-8000-00000000000e',
    gradeType: 'd',
    level: 4,
    labelKey: 'grades.d.4',
    sortOrder: 14
  },
  {
    id: 'a1000000-0000-4000-8000-00000000000f',
    gradeType: 'd',
    level: 5,
    labelKey: 'grades.d.5',
    sortOrder: 15
  },
  {
    id: 'a1000000-0000-4000-8000-000000000010',
    gradeType: 'd',
    level: 6,
    labelKey: 'grades.d.6',
    sortOrder: 16
  },
  {
    id: 'a1000000-0000-4000-8000-000000000011',
    gradeType: 'd',
    level: 7,
    labelKey: 'grades.d.7',
    sortOrder: 17
  },
  {
    id: 'a1000000-0000-4000-8000-000000000012',
    gradeType: 'd',
    level: 8,
    labelKey: 'grades.d.8',
    sortOrder: 18
  },
  {
    id: 'a1000000-0000-4000-8000-000000000013',
    gradeType: 'd',
    level: 9,
    labelKey: 'grades.d.9',
    sortOrder: 19
  },
  {
    id: 'a1000000-0000-4000-8000-000000000014',
    gradeType: 'd',
    level: 10,
    labelKey: 'grades.d.10',
    sortOrder: 20
  }
]

export const WEIGHT_CLASS_SEEDS: WeightClassSeed[] = [
  {
    id: 'b3000000-0000-4000-8000-000000000001',
    djbRow: 3,
    ageClassId: 'c2000000-0000-4000-8000-000000000003',
    maxWeightKg: 34,
    minWeightKg: null,
    sortOrder: 1
  },
  {
    id: 'b3000000-0000-4000-8000-000000000002',
    djbRow: 3,
    ageClassId: 'c2000000-0000-4000-8000-000000000003',
    maxWeightKg: 37,
    minWeightKg: null,
    sortOrder: 2
  },
  {
    id: 'b3000000-0000-4000-8000-000000000003',
    djbRow: 3,
    ageClassId: 'c2000000-0000-4000-8000-000000000003',
    maxWeightKg: 40,
    minWeightKg: null,
    sortOrder: 3
  },
  {
    id: 'b3000000-0000-4000-8000-000000000004',
    djbRow: 3,
    ageClassId: 'c2000000-0000-4000-8000-000000000003',
    maxWeightKg: 43,
    minWeightKg: null,
    sortOrder: 4
  },
  {
    id: 'b3000000-0000-4000-8000-000000000005',
    djbRow: 3,
    ageClassId: 'c2000000-0000-4000-8000-000000000003',
    maxWeightKg: 46,
    minWeightKg: null,
    sortOrder: 5
  },
  {
    id: 'b3000000-0000-4000-8000-000000000006',
    djbRow: 3,
    ageClassId: 'c2000000-0000-4000-8000-000000000003',
    maxWeightKg: 50,
    minWeightKg: null,
    sortOrder: 6
  },
  {
    id: 'b3000000-0000-4000-8000-000000000007',
    djbRow: 3,
    ageClassId: 'c2000000-0000-4000-8000-000000000003',
    maxWeightKg: 55,
    minWeightKg: null,
    sortOrder: 7
  },
  {
    id: 'b3000000-0000-4000-8000-000000000008',
    djbRow: 3,
    ageClassId: 'c2000000-0000-4000-8000-000000000003',
    maxWeightKg: 60,
    minWeightKg: null,
    sortOrder: 8
  },
  {
    id: 'b3000000-0000-4000-8000-000000000009',
    djbRow: 3,
    ageClassId: 'c2000000-0000-4000-8000-000000000003',
    maxWeightKg: 66,
    minWeightKg: null,
    sortOrder: 9
  },
  {
    id: 'b3000000-0000-4000-8000-000000000010',
    djbRow: 3,
    ageClassId: 'c2000000-0000-4000-8000-000000000003',
    maxWeightKg: null,
    minWeightKg: 66,
    sortOrder: 10
  },
  {
    id: 'b3000000-0000-4000-8000-000000000011',
    djbRow: 4,
    ageClassId: 'c2000000-0000-4000-8000-000000000004',
    maxWeightKg: 40,
    minWeightKg: null,
    sortOrder: 11
  },
  {
    id: 'b3000000-0000-4000-8000-000000000012',
    djbRow: 4,
    ageClassId: 'c2000000-0000-4000-8000-000000000004',
    maxWeightKg: 46,
    minWeightKg: null,
    sortOrder: 12
  },
  {
    id: 'b3000000-0000-4000-8000-000000000013',
    djbRow: 4,
    ageClassId: 'c2000000-0000-4000-8000-000000000004',
    maxWeightKg: 55,
    minWeightKg: null,
    sortOrder: 13
  },
  {
    id: 'b3000000-0000-4000-8000-000000000014',
    djbRow: 4,
    ageClassId: 'c2000000-0000-4000-8000-000000000004',
    maxWeightKg: 66,
    minWeightKg: null,
    sortOrder: 14
  },
  {
    id: 'b3000000-0000-4000-8000-000000000015',
    djbRow: 4,
    ageClassId: 'c2000000-0000-4000-8000-000000000004',
    maxWeightKg: null,
    minWeightKg: 64,
    sortOrder: 15
  },
  {
    id: 'b3000000-0000-4000-8000-000000000016',
    djbRow: 5,
    ageClassId: 'c2000000-0000-4000-8000-000000000005',
    maxWeightKg: 46,
    minWeightKg: null,
    sortOrder: 16
  },
  {
    id: 'b3000000-0000-4000-8000-000000000017',
    djbRow: 5,
    ageClassId: 'c2000000-0000-4000-8000-000000000005',
    maxWeightKg: 50,
    minWeightKg: null,
    sortOrder: 17
  },
  {
    id: 'b3000000-0000-4000-8000-000000000018',
    djbRow: 5,
    ageClassId: 'c2000000-0000-4000-8000-000000000005',
    maxWeightKg: 55,
    minWeightKg: null,
    sortOrder: 18
  },
  {
    id: 'b3000000-0000-4000-8000-000000000019',
    djbRow: 5,
    ageClassId: 'c2000000-0000-4000-8000-000000000005',
    maxWeightKg: 60,
    minWeightKg: null,
    sortOrder: 19
  },
  {
    id: 'b3000000-0000-4000-8000-000000000020',
    djbRow: 5,
    ageClassId: 'c2000000-0000-4000-8000-000000000005',
    maxWeightKg: 66,
    minWeightKg: null,
    sortOrder: 20
  },
  {
    id: 'b3000000-0000-4000-8000-000000000021',
    djbRow: 5,
    ageClassId: 'c2000000-0000-4000-8000-000000000005',
    maxWeightKg: 73,
    minWeightKg: null,
    sortOrder: 21
  },
  {
    id: 'b3000000-0000-4000-8000-000000000022',
    djbRow: 5,
    ageClassId: 'c2000000-0000-4000-8000-000000000005',
    maxWeightKg: 81,
    minWeightKg: null,
    sortOrder: 22
  },
  {
    id: 'b3000000-0000-4000-8000-000000000023',
    djbRow: 5,
    ageClassId: 'c2000000-0000-4000-8000-000000000005',
    maxWeightKg: 90,
    minWeightKg: null,
    sortOrder: 23
  },
  {
    id: 'b3000000-0000-4000-8000-000000000024',
    djbRow: 5,
    ageClassId: 'c2000000-0000-4000-8000-000000000005',
    maxWeightKg: null,
    minWeightKg: 90,
    sortOrder: 24
  },
  {
    id: 'b3000000-0000-4000-8000-000000000025',
    djbRow: 6,
    ageClassId: 'c2000000-0000-4000-8000-000000000006',
    maxWeightKg: 50,
    minWeightKg: null,
    sortOrder: 25
  },
  {
    id: 'b3000000-0000-4000-8000-000000000026',
    djbRow: 6,
    ageClassId: 'c2000000-0000-4000-8000-000000000006',
    maxWeightKg: 55,
    minWeightKg: null,
    sortOrder: 26
  },
  {
    id: 'b3000000-0000-4000-8000-000000000027',
    djbRow: 6,
    ageClassId: 'c2000000-0000-4000-8000-000000000006',
    maxWeightKg: 60,
    minWeightKg: null,
    sortOrder: 27
  },
  {
    id: 'b3000000-0000-4000-8000-000000000028',
    djbRow: 6,
    ageClassId: 'c2000000-0000-4000-8000-000000000006',
    maxWeightKg: 66,
    minWeightKg: null,
    sortOrder: 28
  },
  {
    id: 'b3000000-0000-4000-8000-000000000029',
    djbRow: 6,
    ageClassId: 'c2000000-0000-4000-8000-000000000006',
    maxWeightKg: 73,
    minWeightKg: null,
    sortOrder: 29
  },
  {
    id: 'b3000000-0000-4000-8000-000000000030',
    djbRow: 6,
    ageClassId: 'c2000000-0000-4000-8000-000000000006',
    maxWeightKg: null,
    minWeightKg: 73,
    sortOrder: 30
  },
  {
    id: 'b3000000-0000-4000-8000-000000000031',
    djbRow: 7,
    ageClassId: 'c2000000-0000-4000-8000-000000000007',
    maxWeightKg: 60,
    minWeightKg: null,
    sortOrder: 31
  },
  {
    id: 'b3000000-0000-4000-8000-000000000032',
    djbRow: 7,
    ageClassId: 'c2000000-0000-4000-8000-000000000007',
    maxWeightKg: 66,
    minWeightKg: null,
    sortOrder: 32
  },
  {
    id: 'b3000000-0000-4000-8000-000000000033',
    djbRow: 7,
    ageClassId: 'c2000000-0000-4000-8000-000000000007',
    maxWeightKg: 73,
    minWeightKg: null,
    sortOrder: 33
  },
  {
    id: 'b3000000-0000-4000-8000-000000000034',
    djbRow: 7,
    ageClassId: 'c2000000-0000-4000-8000-000000000007',
    maxWeightKg: 81,
    minWeightKg: null,
    sortOrder: 34
  },
  {
    id: 'b3000000-0000-4000-8000-000000000035',
    djbRow: 7,
    ageClassId: 'c2000000-0000-4000-8000-000000000007',
    maxWeightKg: 90,
    minWeightKg: null,
    sortOrder: 35
  },
  {
    id: 'b3000000-0000-4000-8000-000000000036',
    djbRow: 7,
    ageClassId: 'c2000000-0000-4000-8000-000000000007',
    maxWeightKg: 100,
    minWeightKg: null,
    sortOrder: 36
  },
  {
    id: 'b3000000-0000-4000-8000-000000000037',
    djbRow: 7,
    ageClassId: 'c2000000-0000-4000-8000-000000000007',
    maxWeightKg: null,
    minWeightKg: 100,
    sortOrder: 37
  },
  {
    id: 'b3000000-0000-4000-8000-000000000038',
    djbRow: 8,
    ageClassId: 'c2000000-0000-4000-8000-000000000008',
    maxWeightKg: 60,
    minWeightKg: null,
    sortOrder: 38
  },
  {
    id: 'b3000000-0000-4000-8000-000000000039',
    djbRow: 8,
    ageClassId: 'c2000000-0000-4000-8000-000000000008',
    maxWeightKg: 66,
    minWeightKg: null,
    sortOrder: 39
  },
  {
    id: 'b3000000-0000-4000-8000-000000000040',
    djbRow: 8,
    ageClassId: 'c2000000-0000-4000-8000-000000000008',
    maxWeightKg: 73,
    minWeightKg: null,
    sortOrder: 40
  },
  {
    id: 'b3000000-0000-4000-8000-000000000041',
    djbRow: 8,
    ageClassId: 'c2000000-0000-4000-8000-000000000008',
    maxWeightKg: 81,
    minWeightKg: null,
    sortOrder: 41
  },
  {
    id: 'b3000000-0000-4000-8000-000000000042',
    djbRow: 8,
    ageClassId: 'c2000000-0000-4000-8000-000000000008',
    maxWeightKg: 90,
    minWeightKg: null,
    sortOrder: 42
  },
  {
    id: 'b3000000-0000-4000-8000-000000000043',
    djbRow: 8,
    ageClassId: 'c2000000-0000-4000-8000-000000000008',
    maxWeightKg: 100,
    minWeightKg: null,
    sortOrder: 43
  },
  {
    id: 'b3000000-0000-4000-8000-000000000044',
    djbRow: 8,
    ageClassId: 'c2000000-0000-4000-8000-000000000008',
    maxWeightKg: null,
    minWeightKg: 100,
    sortOrder: 44
  },
  {
    id: 'b3000000-0000-4000-8000-000000000045',
    djbRow: 9,
    ageClassId: 'c2000000-0000-4000-8000-000000000009',
    maxWeightKg: 60,
    minWeightKg: null,
    sortOrder: 45
  },
  {
    id: 'b3000000-0000-4000-8000-000000000046',
    djbRow: 9,
    ageClassId: 'c2000000-0000-4000-8000-000000000009',
    maxWeightKg: 66,
    minWeightKg: null,
    sortOrder: 46
  },
  {
    id: 'b3000000-0000-4000-8000-000000000047',
    djbRow: 9,
    ageClassId: 'c2000000-0000-4000-8000-000000000009',
    maxWeightKg: 73,
    minWeightKg: null,
    sortOrder: 47
  },
  {
    id: 'b3000000-0000-4000-8000-000000000048',
    djbRow: 9,
    ageClassId: 'c2000000-0000-4000-8000-000000000009',
    maxWeightKg: 81,
    minWeightKg: null,
    sortOrder: 48
  },
  {
    id: 'b3000000-0000-4000-8000-000000000049',
    djbRow: 9,
    ageClassId: 'c2000000-0000-4000-8000-000000000009',
    maxWeightKg: 90,
    minWeightKg: null,
    sortOrder: 49
  },
  {
    id: 'b3000000-0000-4000-8000-000000000050',
    djbRow: 9,
    ageClassId: 'c2000000-0000-4000-8000-000000000009',
    maxWeightKg: 100,
    minWeightKg: null,
    sortOrder: 50
  },
  {
    id: 'b3000000-0000-4000-8000-000000000051',
    djbRow: 9,
    ageClassId: 'c2000000-0000-4000-8000-000000000009',
    maxWeightKg: null,
    minWeightKg: 100,
    sortOrder: 51
  },
  {
    id: 'b3000000-0000-4000-8000-000000000052',
    djbRow: 12,
    ageClassId: 'c2000000-0000-4000-8000-00000000000c',
    maxWeightKg: 33,
    minWeightKg: null,
    sortOrder: 52
  },
  {
    id: 'b3000000-0000-4000-8000-000000000053',
    djbRow: 12,
    ageClassId: 'c2000000-0000-4000-8000-00000000000c',
    maxWeightKg: 36,
    minWeightKg: null,
    sortOrder: 53
  },
  {
    id: 'b3000000-0000-4000-8000-000000000054',
    djbRow: 12,
    ageClassId: 'c2000000-0000-4000-8000-00000000000c',
    maxWeightKg: 40,
    minWeightKg: null,
    sortOrder: 54
  },
  {
    id: 'b3000000-0000-4000-8000-000000000055',
    djbRow: 12,
    ageClassId: 'c2000000-0000-4000-8000-00000000000c',
    maxWeightKg: 44,
    minWeightKg: null,
    sortOrder: 55
  },
  {
    id: 'b3000000-0000-4000-8000-000000000056',
    djbRow: 12,
    ageClassId: 'c2000000-0000-4000-8000-00000000000c',
    maxWeightKg: 48,
    minWeightKg: null,
    sortOrder: 56
  },
  {
    id: 'b3000000-0000-4000-8000-000000000057',
    djbRow: 12,
    ageClassId: 'c2000000-0000-4000-8000-00000000000c',
    maxWeightKg: 52,
    minWeightKg: null,
    sortOrder: 57
  },
  {
    id: 'b3000000-0000-4000-8000-000000000058',
    djbRow: 12,
    ageClassId: 'c2000000-0000-4000-8000-00000000000c',
    maxWeightKg: 57,
    minWeightKg: null,
    sortOrder: 58
  },
  {
    id: 'b3000000-0000-4000-8000-000000000059',
    djbRow: 12,
    ageClassId: 'c2000000-0000-4000-8000-00000000000c',
    maxWeightKg: 63,
    minWeightKg: null,
    sortOrder: 59
  },
  {
    id: 'b3000000-0000-4000-8000-000000000060',
    djbRow: 12,
    ageClassId: 'c2000000-0000-4000-8000-00000000000c',
    maxWeightKg: null,
    minWeightKg: 63,
    sortOrder: 60
  },
  {
    id: 'b3000000-0000-4000-8000-000000000061',
    djbRow: 13,
    ageClassId: 'c2000000-0000-4000-8000-00000000000d',
    maxWeightKg: 40,
    minWeightKg: null,
    sortOrder: 61
  },
  {
    id: 'b3000000-0000-4000-8000-000000000062',
    djbRow: 13,
    ageClassId: 'c2000000-0000-4000-8000-00000000000d',
    maxWeightKg: 48,
    minWeightKg: null,
    sortOrder: 62
  },
  {
    id: 'b3000000-0000-4000-8000-000000000063',
    djbRow: 13,
    ageClassId: 'c2000000-0000-4000-8000-00000000000d',
    maxWeightKg: 57,
    minWeightKg: null,
    sortOrder: 63
  },
  {
    id: 'b3000000-0000-4000-8000-000000000064',
    djbRow: 13,
    ageClassId: 'c2000000-0000-4000-8000-00000000000d',
    maxWeightKg: 63,
    minWeightKg: null,
    sortOrder: 64
  },
  {
    id: 'b3000000-0000-4000-8000-000000000065',
    djbRow: 13,
    ageClassId: 'c2000000-0000-4000-8000-00000000000d',
    maxWeightKg: null,
    minWeightKg: 61,
    sortOrder: 65
  },
  {
    id: 'b3000000-0000-4000-8000-000000000066',
    djbRow: 14,
    ageClassId: 'c2000000-0000-4000-8000-00000000000e',
    maxWeightKg: 40,
    minWeightKg: null,
    sortOrder: 66
  },
  {
    id: 'b3000000-0000-4000-8000-000000000067',
    djbRow: 14,
    ageClassId: 'c2000000-0000-4000-8000-00000000000e',
    maxWeightKg: 44,
    minWeightKg: null,
    sortOrder: 67
  },
  {
    id: 'b3000000-0000-4000-8000-000000000068',
    djbRow: 14,
    ageClassId: 'c2000000-0000-4000-8000-00000000000e',
    maxWeightKg: 48,
    minWeightKg: null,
    sortOrder: 68
  },
  {
    id: 'b3000000-0000-4000-8000-000000000069',
    djbRow: 14,
    ageClassId: 'c2000000-0000-4000-8000-00000000000e',
    maxWeightKg: 52,
    minWeightKg: null,
    sortOrder: 69
  },
  {
    id: 'b3000000-0000-4000-8000-000000000070',
    djbRow: 14,
    ageClassId: 'c2000000-0000-4000-8000-00000000000e',
    maxWeightKg: 57,
    minWeightKg: null,
    sortOrder: 70
  },
  {
    id: 'b3000000-0000-4000-8000-000000000071',
    djbRow: 14,
    ageClassId: 'c2000000-0000-4000-8000-00000000000e',
    maxWeightKg: 63,
    minWeightKg: null,
    sortOrder: 71
  },
  {
    id: 'b3000000-0000-4000-8000-000000000072',
    djbRow: 14,
    ageClassId: 'c2000000-0000-4000-8000-00000000000e',
    maxWeightKg: 70,
    minWeightKg: null,
    sortOrder: 72
  },
  {
    id: 'b3000000-0000-4000-8000-000000000073',
    djbRow: 14,
    ageClassId: 'c2000000-0000-4000-8000-00000000000e',
    maxWeightKg: 78,
    minWeightKg: null,
    sortOrder: 73
  },
  {
    id: 'b3000000-0000-4000-8000-000000000074',
    djbRow: 14,
    ageClassId: 'c2000000-0000-4000-8000-00000000000e',
    maxWeightKg: null,
    minWeightKg: 78,
    sortOrder: 74
  },
  {
    id: 'b3000000-0000-4000-8000-000000000075',
    djbRow: 15,
    ageClassId: 'c2000000-0000-4000-8000-00000000000f',
    maxWeightKg: 44,
    minWeightKg: null,
    sortOrder: 75
  },
  {
    id: 'b3000000-0000-4000-8000-000000000076',
    djbRow: 15,
    ageClassId: 'c2000000-0000-4000-8000-00000000000f',
    maxWeightKg: 48,
    minWeightKg: null,
    sortOrder: 76
  },
  {
    id: 'b3000000-0000-4000-8000-000000000077',
    djbRow: 15,
    ageClassId: 'c2000000-0000-4000-8000-00000000000f',
    maxWeightKg: 52,
    minWeightKg: null,
    sortOrder: 77
  },
  {
    id: 'b3000000-0000-4000-8000-000000000078',
    djbRow: 15,
    ageClassId: 'c2000000-0000-4000-8000-00000000000f',
    maxWeightKg: 57,
    minWeightKg: null,
    sortOrder: 78
  },
  {
    id: 'b3000000-0000-4000-8000-000000000079',
    djbRow: 15,
    ageClassId: 'c2000000-0000-4000-8000-00000000000f',
    maxWeightKg: 63,
    minWeightKg: null,
    sortOrder: 79
  },
  {
    id: 'b3000000-0000-4000-8000-000000000080',
    djbRow: 15,
    ageClassId: 'c2000000-0000-4000-8000-00000000000f',
    maxWeightKg: null,
    minWeightKg: 63,
    sortOrder: 80
  },
  {
    id: 'b3000000-0000-4000-8000-000000000081',
    djbRow: 16,
    ageClassId: 'c2000000-0000-4000-8000-000000000010',
    maxWeightKg: 48,
    minWeightKg: null,
    sortOrder: 81
  },
  {
    id: 'b3000000-0000-4000-8000-000000000082',
    djbRow: 16,
    ageClassId: 'c2000000-0000-4000-8000-000000000010',
    maxWeightKg: 52,
    minWeightKg: null,
    sortOrder: 82
  },
  {
    id: 'b3000000-0000-4000-8000-000000000083',
    djbRow: 16,
    ageClassId: 'c2000000-0000-4000-8000-000000000010',
    maxWeightKg: 57,
    minWeightKg: null,
    sortOrder: 83
  },
  {
    id: 'b3000000-0000-4000-8000-000000000084',
    djbRow: 16,
    ageClassId: 'c2000000-0000-4000-8000-000000000010',
    maxWeightKg: 63,
    minWeightKg: null,
    sortOrder: 84
  },
  {
    id: 'b3000000-0000-4000-8000-000000000085',
    djbRow: 16,
    ageClassId: 'c2000000-0000-4000-8000-000000000010',
    maxWeightKg: 70,
    minWeightKg: null,
    sortOrder: 85
  },
  {
    id: 'b3000000-0000-4000-8000-000000000086',
    djbRow: 16,
    ageClassId: 'c2000000-0000-4000-8000-000000000010',
    maxWeightKg: 78,
    minWeightKg: null,
    sortOrder: 86
  },
  {
    id: 'b3000000-0000-4000-8000-000000000087',
    djbRow: 16,
    ageClassId: 'c2000000-0000-4000-8000-000000000010',
    maxWeightKg: null,
    minWeightKg: 78,
    sortOrder: 87
  },
  {
    id: 'b3000000-0000-4000-8000-000000000088',
    djbRow: 17,
    ageClassId: 'c2000000-0000-4000-8000-000000000011',
    maxWeightKg: 48,
    minWeightKg: null,
    sortOrder: 88
  },
  {
    id: 'b3000000-0000-4000-8000-000000000089',
    djbRow: 17,
    ageClassId: 'c2000000-0000-4000-8000-000000000011',
    maxWeightKg: 52,
    minWeightKg: null,
    sortOrder: 89
  },
  {
    id: 'b3000000-0000-4000-8000-000000000090',
    djbRow: 17,
    ageClassId: 'c2000000-0000-4000-8000-000000000011',
    maxWeightKg: 57,
    minWeightKg: null,
    sortOrder: 90
  },
  {
    id: 'b3000000-0000-4000-8000-000000000091',
    djbRow: 17,
    ageClassId: 'c2000000-0000-4000-8000-000000000011',
    maxWeightKg: 63,
    minWeightKg: null,
    sortOrder: 91
  },
  {
    id: 'b3000000-0000-4000-8000-000000000092',
    djbRow: 17,
    ageClassId: 'c2000000-0000-4000-8000-000000000011',
    maxWeightKg: 70,
    minWeightKg: null,
    sortOrder: 92
  },
  {
    id: 'b3000000-0000-4000-8000-000000000093',
    djbRow: 17,
    ageClassId: 'c2000000-0000-4000-8000-000000000011',
    maxWeightKg: 78,
    minWeightKg: null,
    sortOrder: 93
  },
  {
    id: 'b3000000-0000-4000-8000-000000000094',
    djbRow: 17,
    ageClassId: 'c2000000-0000-4000-8000-000000000011',
    maxWeightKg: null,
    minWeightKg: 78,
    sortOrder: 94
  },
  {
    id: 'b3000000-0000-4000-8000-000000000095',
    djbRow: 18,
    ageClassId: 'c2000000-0000-4000-8000-000000000012',
    maxWeightKg: 48,
    minWeightKg: null,
    sortOrder: 95
  },
  {
    id: 'b3000000-0000-4000-8000-000000000096',
    djbRow: 18,
    ageClassId: 'c2000000-0000-4000-8000-000000000012',
    maxWeightKg: 52,
    minWeightKg: null,
    sortOrder: 96
  },
  {
    id: 'b3000000-0000-4000-8000-000000000097',
    djbRow: 18,
    ageClassId: 'c2000000-0000-4000-8000-000000000012',
    maxWeightKg: 57,
    minWeightKg: null,
    sortOrder: 97
  },
  {
    id: 'b3000000-0000-4000-8000-000000000098',
    djbRow: 18,
    ageClassId: 'c2000000-0000-4000-8000-000000000012',
    maxWeightKg: 63,
    minWeightKg: null,
    sortOrder: 98
  },
  {
    id: 'b3000000-0000-4000-8000-000000000099',
    djbRow: 18,
    ageClassId: 'c2000000-0000-4000-8000-000000000012',
    maxWeightKg: 70,
    minWeightKg: null,
    sortOrder: 99
  },
  {
    id: 'b3000000-0000-4000-8000-000000000100',
    djbRow: 18,
    ageClassId: 'c2000000-0000-4000-8000-000000000012',
    maxWeightKg: 78,
    minWeightKg: null,
    sortOrder: 100
  },
  {
    id: 'b3000000-0000-4000-8000-000000000101',
    djbRow: 18,
    ageClassId: 'c2000000-0000-4000-8000-000000000012',
    maxWeightKg: null,
    minWeightKg: 78,
    sortOrder: 101
  }
]

export const CLUB_SEEDS: ClubSeed[] = [
  {
    id: '00000000-0000-0000-0000-000000000000',
    nameKey: 'unknown'
  }
]

export const NATIONALITY_CODES = ['DE', 'AT', 'CH'] as const
