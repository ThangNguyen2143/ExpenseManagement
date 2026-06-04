import { useEffect, useMemo, useState } from 'react';

import { appServices } from '@/src/services/app.service';
import { CategoryRuleModel } from '@/src/types/Models/CategoryRule';
import { JarModel } from '@/src/types/Models/Jar';
import { normalizeText } from '@/src/utils/normalizeText';
import { parseQuickInput } from '@/src/utils/parseText';

type SuggestedJar = {
  id: string;
  name: string;
  score: number;
};

export function useQuickTransactionSuggestions(text: string, accountId?: string) {
  const [isLoading, setIsLoading] = useState(false);

  const [allJars, setAllJars] = useState<JarModel[]>([]);
  const [rules, setRules] = useState<CategoryRuleModel[]>([]);

  const [debouncedText, setDebouncedText] = useState(text);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedText(text);
    }, 250);

    return () => clearTimeout(timeout);
  }, [text]);

  useEffect(() => {
    if (!accountId) return;

    let mounted = true;

    async function loadData(accountId: string) {
      try {
        setIsLoading(true);

        const [jars, categoryRules]: [JarModel[], CategoryRuleModel[]] = await Promise.all([
          appServices.repositories.jarRepository.findByAccount(accountId),
          appServices.repositories.categoryRuleRepository.getAll(),
        ]);

        if (!mounted) return;

        setAllJars(jars);
        setRules(categoryRules);
      } catch (error) {
        console.error('Failed to load quick transaction suggestions', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadData(accountId);

    return () => {
      mounted = false;
    };
  }, [accountId]);

  const parsed = useMemo(() => {
    return parseQuickInput(debouncedText);
  }, [debouncedText]);

  const suggestedJars = useMemo<SuggestedJar[]>(() => {
    if (!parsed.title) return [];

    const normalizedTitle = normalizeText(parsed.title);

    const scoreMap = new Map<string, SuggestedJar>();

    for (const rule of rules) {
      const keyword = normalizeText(rule.normalizedKeyword);

      if (!keyword) continue;

      let score = 0;

      if (normalizedTitle.includes(keyword)) {
        score = keyword.length * 10;
      }

      if (score <= 0) continue;

      const jar = allJars.find((j) => j.id === rule.jarId);

      if (!jar) continue;

      const existing = scoreMap.get(jar.id);

      if (!existing || score > existing.score) {
        scoreMap.set(jar.id, {
          id: jar.id,
          name: jar.name,
          score,
        });
      }
    }
    if (scoreMap.size === 0)
      return [allJars.find((j) => j.isDefault)].filter(Boolean).map((jar) => ({
        id: jar?.id,
        name: jar?.name,
        score: 0,
      })) as SuggestedJar[];
    return [...scoreMap.values()].sort((a, b) => b.score - a.score).slice(0, 5);
  }, [parsed.title, rules, allJars]);

  return {
    parsed,
    suggestedJars,
    isLoading,
  };
}
