$files = @(
    "src/components/Balance.tsx",
    "src/components/CaseCard.tsx",
    "src/components/Layout.tsx",
    "src/components/OpeningAnimation.tsx",
    "src/hooks/useUser.ts",
    "src/pages/AdminCases.tsx",
    "src/pages/AdminStats.tsx"
)

foreach ($file in $files) {
    # Проверяем, существует ли файл
    if (-not (Test-Path $file)) {
        # Если файла нет, создаём с минимальным содержимым
        $content = ""
        switch -wildcard ($file) {
            "*.tsx" {
                $content = @"
import React from 'react';

const Component: React.FC = () => {
    return <div>Заглушка</div>;
};

export default Component;
"@
            }
            "*.ts" {
                $content = "export {};"
            }
        }
        Set-Content -Path $file -Value $content -Encoding utf8
    } else {
        # Если файл существует, но в нём нет export/import, добавляем export {}
        $content = Get-Content $file -Raw
        if ($content -notmatch 'export\s+\{|\bimport\s+') {
            Add-Content $file "`nexport {};"
        }
    }
}